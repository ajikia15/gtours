"use server";

/**
 * Checkout Server Actions
 *
 * This file contains server-side functions for processing checkout operations.
 * It creates invoice documents in Firebase that trigger the PDF generation extension.
 *
 * Template Configuration:
 * The PDF template is configured at the Firebase extension level and should point
 * to the template stored in Firebase Storage at `/templates/gtours-invoice/index.html`.
 * The template name is not specified dynamically but is configured in the extension settings.
 */

import { firestore } from "@/firebase/server";
import { requireUserAuth } from "@/lib/auth-utils";
import { CartItem } from "@/types/Cart";
import { getUserCart, clearCart } from "@/data/cart";
import { getUserProfile } from "@/data/userProfile";

/**
 * Interface for invoice document that will be created in Firebase
 * Compatible with @https://extensions.dev/extensions/pdfplum/firestore-pdf-generator
 */
export interface InvoiceDocument {
  // PDF Extension required fields
  output: {
    location: string;
    name: string;
  };
  data: {
    // Invoice metadata
    invoiceNumber: string;
    invoiceDate: string;

    // Customer information (simple)
    customer: {
      name: string;
      email: string;
      phone?: string;
    };

    // Order summary data (matching the OrderSummary component)
    summary: {
      tours: number;
      toursPrice: number;
      startDate: string;
      tourists: number;
      touristsPrice: number;
      activities: number;
      activitiesPrice: number;
      locations: string;
      totalPrice: number;
      currency: string;
    };

    // Simple tour details
    tourDetails: {
      tourTitle: string;
      selectedDate: string;
      travelers: string;
      activities: string[];
      price: number;
    }[];
  };

  // Extension will populate these fields
  status?: "pending" | "processing" | "completed" | "error";
  downloadURL?: string;
  createdAt?: Date;
  completedAt?: Date;
  error?: string;

  // Our custom fields
  userId: string;
  userEmail: string;
  orderItems: CartItem[];
}

/**
 * Result of checkout operation
 */
export interface CheckoutResult {
  success: boolean;
  invoiceId?: string;
  invoiceNumber?: string;
  error?: string;
  message?: string;
}

/**
 * Processes checkout and creates invoice document in Firebase
 * This will trigger the PDF generation extension
 */
export async function processCheckout(
  authToken?: string
): Promise<CheckoutResult> {
  try {
    // Verify authentication
    const verifiedToken = await requireUserAuth(authToken);
    const userId = verifiedToken.uid;
    const userEmail = verifiedToken.email || "";

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

    // Generate unique invoice number and ID
    const invoiceNumber = `INV-${Date.now()}`;
    const now = new Date();
    // Calculate summary from cart
    const summary = {
      tours: cartResult.cart.length,
      toursPrice: cartResult.cart.reduce(
        (sum, item) => sum + (item.tourBasePrice || 0),
        0
      ),
      startDate: cartResult.cart[0]?.selectedDate || "TBD",
      tourists: cartResult.cart.reduce(
        (sum, item) =>
          sum +
          (item.travelers.adults +
            item.travelers.children +
            item.travelers.infants),
        0
      ),
      touristsPrice: cartResult.cart.reduce(
        (sum, item) =>
          sum +
          item.tourBasePrice *
            (item.travelers.adults +
              item.travelers.children +
              item.travelers.infants),
        0
      ),
      activities: cartResult.cart.reduce(
        (sum, item) => sum + (item.selectedActivities?.length || 0),
        0
      ),
      activitiesPrice: cartResult.cart.reduce(
        (sum, item) => sum + (item.activityPriceIncrement || 0),
        0
      ),
      locations: cartResult.cart.length, // Each cart item represents one location/tour
      totalPrice: cartResult.cart.reduce(
        (sum, item) => sum + (item.totalPrice || 0),
        0
      ),
      currency: "GEL",
    }; // Prepare tour details for template
    const tourDetails = cartResult.cart.map((item) => ({
      tourTitle: item.tourTitle || "Unknown Tour",
      selectedDate: item.selectedDate || "TBD",
      travelers:
        item.travelers.adults +
        item.travelers.children +
        item.travelers.infants,
      activities: item.selectedActivities || [],
      price: item.totalPrice || 0,
    })); // Create the invoice document with the structure expected by the PDF extension
    const invoiceDoc = await firestore.collection("invoices").add({
      // PDF Extension required fields
      status: "pending", // Extension will update this

      // Template data (this gets passed to your HTML template)
      data: {
        invoiceNumber,
        invoiceDate: now.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        customer: {
          name: `${userProfile.firstName} ${userProfile.lastName}`,
          email: userProfile.email,
          phone: userProfile.phoneNumber || null,
        },
        summary,
        tourDetails,
      },

      // Output configuration - where to save the PDF
      output: {
        location: `invoices/${userId}`, // Folder in Firebase Storage
        name: `invoice-${invoiceNumber}.pdf`, // PDF filename
      },

      // Additional metadata
      userId,
      userEmail,
      orderItems: cartResult.cart,
      createdAt: now,
    });

    // Clear the user's cart after successful checkout
    const clearResult = await clearCart();
    if (!clearResult.success) {
      console.warn("Failed to clear cart after checkout:", clearResult.error);
    }

    return {
      success: true,
      invoiceId: invoiceDoc.id,
      invoiceNumber,
      message:
        "Checkout completed successfully! You will receive an email with your invoice shortly.",
    };
  } catch (error) {
    console.error("Error processing checkout:", error);
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
 * Converts Firebase Timestamp objects to ISO strings for client serialization
 */
function serializeFirestoreData(data: any): any {
  if (!data) return data;

  if (data._seconds !== undefined && data._nanoseconds !== undefined) {
    // This is a Firebase Timestamp
    return new Date(
      data._seconds * 1000 + data._nanoseconds / 1000000
    ).toISOString();
  }

  if (Array.isArray(data)) {
    return data.map(serializeFirestoreData);
  }

  if (typeof data === "object" && data !== null) {
    const serialized: any = {};
    for (const [key, value] of Object.entries(data)) {
      serialized[key] = serializeFirestoreData(value);
    }
    return serialized;
  }

  return data;
}

/**
 * Gets invoice status by ID (for checking PDF generation progress)
 */
export async function getInvoiceStatus(
  invoiceId: string,
  authToken?: string
): Promise<{
  success: boolean;
  invoice?: {
    status: string;
    downloadURL?: string;
    data?: any;
    error?: string;
  };
  error?: string;
}> {
  try {
    const verifiedToken = await requireUserAuth(authToken);

    const invoiceDoc = await firestore
      .collection("invoices")
      .doc(invoiceId)
      .get();

    if (!invoiceDoc.exists) {
      return {
        success: false,
        error: "Invoice not found",
      };
    }

    const invoiceData = invoiceDoc.data();

    // Verify the invoice belongs to the current user
    if (invoiceData?.userId !== verifiedToken.uid) {
      return {
        success: false,
        error: "Unauthorized access to invoice",
      };
    }

    // Serialize the data to handle Firebase Timestamps
    const serializedData = serializeFirestoreData(invoiceData?.data);

    return {
      success: true,
      invoice: {
        status: invoiceData.status || "pending",
        downloadURL: invoiceData.downloadURL, // Set by the extension when PDF is ready
        data: serializedData,
        error: invoiceData.error, // Set by extension if there's an error
      },
    };
  } catch (error) {
    console.error("Error getting invoice status:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get invoice status",
    };
  }
}
