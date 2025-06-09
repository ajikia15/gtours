/**
 * Payment Status API Route
 *
 * Allows checking the status of a payment order
 */

import { NextRequest, NextResponse } from "next/server";
import { firestore } from "@/firebase/server";
import { requireUserAuth } from "@/lib/auth-utils";
import type { PaymentOrder } from "@/types/BOG";

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    // Get auth token from headers
    const authToken = request.headers
      .get("authorization")
      ?.replace("Bearer ", "");

    // Verify authentication
    const verifiedToken = await requireUserAuth(authToken);
    const userId = verifiedToken.uid;

    const orderId = params.orderId;
    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Get payment order from Firebase
    const paymentOrderRef = firestore.collection("payment_orders").doc(orderId);
    const paymentOrderDoc = await paymentOrderRef.get();

    if (!paymentOrderDoc.exists) {
      return NextResponse.json(
        { error: "Payment order not found" },
        { status: 404 }
      );
    }

    const paymentOrder = paymentOrderDoc.data() as PaymentOrder;

    // Verify the order belongs to the current user
    if (paymentOrder.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized access to payment order" },
        { status: 403 }
      );
    }

    // Return sanitized payment order data
    return NextResponse.json({
      success: true,
      order: {
        id: paymentOrder.id,
        status: paymentOrder.status,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        createdAt: paymentOrder.createdAt,
        updatedAt: paymentOrder.updatedAt,
        callbackReceived: paymentOrder.callbackReceived,
        invoiceId: paymentOrder.invoiceId,
      },
    });
  } catch (error) {
    console.error("Error getting payment status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
