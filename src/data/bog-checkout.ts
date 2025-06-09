"use server";

/**
 * Bank of Georgia Integrated Checkout Service
 *
 * Handles the complete checkout flow with BOG payment integration:
 * 1. Create BOG payment order
 * 2. Store payment order in Firebase
 * 3. Return redirect URL for payment
 * 4. Handle callbacks to complete invoice creation
 */

import { firestore } from "@/firebase/server";
import { requireUserAuth } from "@/lib/auth-utils";
import { getUserCart } from "@/data/cart";
import { getUserProfile } from "@/data/userProfile";
import { createOrder } from "@/lib/bog-api";
import { cartItemsToBOGBasket, maskEmail, maskPhone } from "@/lib/bog-utils";
import type { PaymentOrder, BOGOrderRequest } from "@/types/BOG";
import type { CheckoutResult } from "@/data/checkout";

/**
 * Enhanced checkout result that includes payment redirect URL
 */
export interface BOGCheckoutResult extends CheckoutResult {
  paymentOrderId?: string;
  redirectUrl?: string;
  requiresPayment?: boolean;
}

/**
 * Process checkout with BOG payment integration
 * Creates a payment order and redirects user to BOG payment page
 */
export async function processCheckoutWithBOG(
  authToken?: string
): Promise<BOGCheckoutResult> {
  try {
    // Verify authentication
    const verifiedToken = await requireUserAuth(authToken);
    const userId = verifiedToken.uid;

    // Get user profile
    const userProfile = await getUserProfile(authToken);
    if (!userProfile) {
      return {
        success: false,
        error: "Profile not found",
        message: "Please complete your profile before checkout",
      };
    }

    // Validate required profile fields
    if (!userProfile.firstName || !userProfile.lastName || !userProfile.email) {
      return {
        success: false,
        error: "Incomplete profile",
        message: "Please complete all required profile fields",
      };
    }

    // Get user cart
    const cartResult = await getUserCart();
    if (
      !cartResult.success ||
      !cartResult.cart ||
      cartResult.cart.length === 0
    ) {
      return {
        success: false,
        error: "Empty cart",
        message: "Your cart is empty",
      };
    }

    // Validate cart items are complete
    const incompleteItems = cartResult.cart.filter((item) => !item.isComplete);
    if (incompleteItems.length > 0) {
      return {
        success: false,
        error: "Incomplete booking details",
        message: "Please complete all booking details for your tours",
      };
    }

    // Convert cart to BOG basket format
    const { basket, totalAmount } = cartItemsToBOGBasket(cartResult.cart);

    if (totalAmount <= 0) {
      return {
        success: false,
        error: "Invalid total amount",
        message: "Cart total must be greater than 0",
      };
    }

    // Generate unique external order ID
    const externalOrderId = `gtours-${Date.now()}-${userId.slice(-8)}`;

    // Prepare BOG order request
    const bogOrderRequest: BOGOrderRequest = {
      application_type: "web",
      buyer: {
        full_name: `${userProfile.firstName} ${userProfile.lastName}`,
        masked_email: maskEmail(userProfile.email),
        masked_phone: userProfile.phoneNumber
          ? maskPhone(userProfile.phoneNumber)
          : undefined,
      },
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/bog/callback`,
      external_order_id: externalOrderId,
      capture: "automatic",
      purchase_units: {
        basket,
        total_amount: totalAmount,
        currency: "GEL",
      },
      redirect_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/account/payment/success`,
        fail: `${process.env.NEXT_PUBLIC_APP_URL}/account/payment/failed`,
      },
      ttl: 30, // 30 minutes to complete payment
      payment_method: ["card", "bog_p2p"], // Allow cards and BOG P2P transfers
    };

    // Create BOG payment order
    const bogOrderResult = await createOrder(bogOrderRequest);
    if (!bogOrderResult.success) {
      console.error("Failed to create BOG order:", bogOrderResult.error);
      return {
        success: false,
        error: "Payment system error",
        message: "Failed to initialize payment. Please try again.",
      };
    }

    // Store payment order in Firebase
    const paymentOrder: PaymentOrder = {
      id: bogOrderResult.data.id,
      bogOrderId: bogOrderResult.data.id,
      userId,
      status: "pending",
      amount: totalAmount,
      currency: "GEL",
      redirectUrl: bogOrderResult.data._links.redirect.href,
      callbackReceived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await firestore
      .collection("payment_orders")
      .doc(paymentOrder.id)
      .set(paymentOrder);

    console.log("Payment order created:", {
      paymentOrderId: paymentOrder.id,
      userId,
      amount: totalAmount,
      externalOrderId,
    });

    return {
      success: true,
      requiresPayment: true,
      paymentOrderId: paymentOrder.id,
      redirectUrl: paymentOrder.redirectUrl,
      message: "Payment order created. Redirecting to payment page...",
    };
  } catch (error) {
    console.error("Error processing BOG checkout:", error);
    return {
      success: false,
      error: "Checkout failed",
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during checkout",
    };
  }
}

/**
 * Complete the checkout process after successful payment
 * This is called by the callback handler when payment is confirmed
 */
export async function completeCheckoutAfterPayment(
  paymentOrderId: string,
  authToken?: string
): Promise<CheckoutResult> {
  try {
    // Import the original checkout function to complete invoice creation
    const { processCheckout } = await import("@/data/checkout");

    // Get the payment order
    const paymentOrderDoc = await firestore
      .collection("payment_orders")
      .doc(paymentOrderId)
      .get();

    if (!paymentOrderDoc.exists) {
      throw new Error("Payment order not found");
    }

    const paymentOrder = paymentOrderDoc.data() as PaymentOrder;

    // Verify payment was successful
    if (paymentOrder.status !== "completed") {
      throw new Error("Payment not completed");
    }

    // Create the invoice using the original process
    const invoiceResult = await processCheckout(authToken);

    if (invoiceResult.success && invoiceResult.invoiceId) {
      // Link the invoice to the payment order
      await firestore.collection("payment_orders").doc(paymentOrderId).update({
        invoiceId: invoiceResult.invoiceId,
        updatedAt: new Date(),
      });
    }

    return invoiceResult;
  } catch (error) {
    console.error("Error completing checkout after payment:", error);
    return {
      success: false,
      error: "Invoice creation failed",
      message:
        "Payment completed but invoice creation failed. Please contact support.",
    };
  }
}
