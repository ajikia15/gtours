/**
 * Bank of Georgia Payment Callback Handler
 * 
 * Handles webhooks/callbacks from BOG payment system
 * Updates payment status and triggers order completion
 */

import { NextRequest, NextResponse } from "next/server";
import { firestore } from "@/firebase/server";
import type { BOGCallback, PaymentOrder } from "@/types/BOG";

export async function POST(request: NextRequest) {
  try {
    // Parse the callback data
    const callbackData: BOGCallback = await request.json();
    
    console.log("BOG Callback received:", {
      orderId: callbackData.order_id,
      status: callbackData.status,
      timestamp: new Date().toISOString(),
    });

    // Validate required fields
    if (!callbackData.order_id || !callbackData.status) {
      console.error("Invalid BOG callback: missing required fields", callbackData);
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find the payment order in Firebase
    const paymentOrderRef = firestore.collection("payment_orders").doc(callbackData.order_id);
    const paymentOrderDoc = await paymentOrderRef.get();

    if (!paymentOrderDoc.exists) {
      console.error("Payment order not found:", callbackData.order_id);
      return NextResponse.json(
        { error: "Payment order not found" },
        { status: 404 }
      );
    }

    const paymentOrder = paymentOrderDoc.data() as PaymentOrder;

    // Update payment order with callback data
    const updatedStatus = mapBOGStatusToPaymentStatus(callbackData.status);
    const updates: Partial<PaymentOrder> = {
      status: updatedStatus,
      callbackReceived: true,
      bogCallback: callbackData,
      updatedAt: new Date(),
    };

    await paymentOrderRef.update(updates);

    console.log("Payment order updated:", {
      orderId: callbackData.order_id,
      oldStatus: paymentOrder.status,
      newStatus: updatedStatus,
    });

    // Handle successful payment
    if (callbackData.status === "success") {
      await handleSuccessfulPayment(paymentOrder, callbackData);
    } else if (callbackData.status === "failed") {
      await handleFailedPayment(paymentOrder, callbackData);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing BOG callback:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Map BOG payment status to our internal payment status
 */
function mapBOGStatusToPaymentStatus(bogStatus: string): PaymentOrder["status"] {
  switch (bogStatus) {
    case "success":
      return "completed";
    case "failed":
      return "failed";
    case "pending":
      return "processing";
    default:
      return "pending";
  }
}

/**
 * Handle successful payment completion
 */
async function handleSuccessfulPayment(
  paymentOrder: PaymentOrder,
  callbackData: BOGCallback
) {
  try {
    console.log("Processing successful payment:", paymentOrder.id);

    // Complete the checkout process - create invoice and send email
    if (!paymentOrder.invoiceId) {
      const { completeCheckoutAfterPayment } = await import("@/data/bog-checkout");
      const invoiceResult = await completeCheckoutAfterPayment(paymentOrder.id);
      
      if (invoiceResult.success) {
        console.log("Invoice created after payment:", invoiceResult.invoiceId);
      } else {
        console.error("Failed to create invoice after payment:", invoiceResult.error);
        // Payment succeeded but invoice creation failed - log for manual processing
      }
    } else {
      // Invoice already exists, just update payment status
      const invoiceRef = firestore.collection("invoices").doc(paymentOrder.invoiceId);
      await invoiceRef.update({
        paymentStatus: "completed",
        paymentMethod: "bog_payment",
        bogTransactionId: callbackData.transaction_id,
        paidAt: new Date(),
        updatedAt: new Date(),
      });

      console.log("Invoice updated for successful payment:", paymentOrder.invoiceId);
    }

    console.log("Payment processing completed for order:", paymentOrder.id);
    
  } catch (error) {
    console.error("Error handling successful payment:", error);
    // Don't throw - we already received the payment, log for manual processing
  }
}

/**
 * Handle failed payment
 */
async function handleFailedPayment(
  paymentOrder: PaymentOrder,
  callbackData: BOGCallback
) {
  try {
    console.log("Processing failed payment:", paymentOrder.id);

    // If we have an associated invoice, update its status
    if (paymentOrder.invoiceId) {
      const invoiceRef = firestore.collection("invoices").doc(paymentOrder.invoiceId);
      await invoiceRef.update({
        paymentStatus: "failed",
        paymentMethod: "bog_payment",
        failureReason: callbackData.error || "Payment failed",
        updatedAt: new Date(),
      });

      console.log("Invoice updated for failed payment:", paymentOrder.invoiceId);
    }

    // TODO: Add any additional failure handling here
    // - Send failure notification
    // - Restore cart items
    // - Log for manual review
    
  } catch (error) {
    console.error("Error handling failed payment:", error);
  }
}

// Only allow POST requests
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}
