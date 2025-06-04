"use server";

/**
 * Checkout Server Actions
 *
 * This file contains server-side functions for processing checkout operations.
 * It creates invoice documents in Firebase that trigger the PDF generation extension
 * and sends email notifications using SendGrid Dynamic Templates.
 *
 * Template Configuration:
 * - PDF template is configured at the Firebase extension level
 * - Email template uses SendGrid Dynamic Templates with templateId and dynamicTemplateData
 * - SendGrid template ID: d-a6b05232823142619e447d18f23e0d42
 *
 * Key Features:
 * - Simplified invoice status (always "completed")
 * - Direct PDF download links
 * - Clean interface without legacy fields
 * - Proper date formatting for all templates
 */

import { firestore } from "@/firebase/server";
import { requireUserAuth } from "@/lib/auth-utils";
import { getUserCart, clearCart } from "@/data/cart";
import { getUserProfile } from "@/data/userProfile";

/**
 * Interface for invoice document that will be created in Firebase
 * Compatible with @https://extensions.dev/extensions/pdfplum/firestore-pdf-generator
 * and @https://extensions.dev/extensions/firebase/firestore-send-email
 *
 * PDFPlum extension passes the entire document (except _pdfplum_config) to Handlebars template.
 * Template variables should be at the root level of the document.
 *
 * Email extension looks for "to" and "sendGrid" fields for SendGrid Dynamic Templates.
 */
export interface InvoiceDocument {
  // Template data (at root level for Handlebars access)
  invoiceNumber: string;
  invoiceDate: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
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
  tourDetails: {
    tourTitle: string;
    selectedDate: string;
    travelers: string;
    activities: string[];
    price: number;
  }[];

  // Email Extension fields (will trigger email sending)
  to: string[];
  sendGrid: {
    templateId: string; // SendGrid Dynamic Template ID
    dynamicTemplateData: any; // Data to populate template
  };
  // PDF Extension required fields
  output: {
    location: string;
    name: string;
  };

  // Our custom metadata fields
  userId: string;
  createdAt?: Date;
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
    const now = new Date();
    // Format dates as simple strings for templates
    const invoiceDate = `${now.getDate()}/${
      now.getMonth() + 1
    }/${now.getFullYear()}`;
    const startDate = cartResult.cart[0]?.selectedDate || "TBD";
    // Format start date - handle both string and Date types
    const formattedStartDate =
      startDate === "TBD"
        ? "TBD"
        : (() => {
            const date =
              startDate instanceof Date ? startDate : new Date(startDate);
            return `${date.getDate()}/${
              date.getMonth() + 1
            }/${date.getFullYear()}`;
          })();

    // Calculate summary from cart
    const summary = {
      tours: cartResult.cart.length,
      toursPrice: cartResult.cart.reduce(
        (sum, item) => sum + (item.tourBasePrice || 0),
        0
      ),
      startDate: formattedStartDate,
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
    const tourDetails = cartResult.cart.map((item) => {
      const tourDate = item.selectedDate || "TBD";
      // Format tour date - handle both string and Date types
      const formattedTourDate =
        tourDate === "TBD"
          ? "TBD"
          : (() => {
              const date =
                tourDate instanceof Date ? tourDate : new Date(tourDate);
              return `${date.getDate()}/${
                date.getMonth() + 1
              }/${date.getFullYear()}`;
            })();

      return {
        tourTitle: item.tourTitle || "Unknown Tour",
        selectedDate: formattedTourDate,
        travelers:
          item.travelers.adults +
          item.travelers.children +
          item.travelers.infants,
        activities: item.selectedActivities || [],
        price: item.totalPrice || 0,
      };
    }); // Create the invoice document with the structure expected by the PDF extension
    // PDFPlum passes the entire document (except _pdfplum_config) to Handlebars
    // Since PDFs are stored as {documentId}.pdf, we can generate the document first,
    // then use its ID for the email content
    const tempInvoiceDoc = await firestore.collection("invoices").doc();
    const invoiceId = tempInvoiceDoc.id;
    await tempInvoiceDoc.set({
      // Template data at root level for Handlebars (these become {{variableName}})
      invoiceNumber: invoiceId, // Use document ID as invoice number
      invoiceDate: invoiceDate, // Use formatted date string
      customer: {
        name: `${userProfile.firstName} ${userProfile.lastName}`,
        email: userProfile.email,
        phone: userProfile.phoneNumber || undefined, // undefined removes the field
      },
      summary,
      tourDetails, // Email Extension fields (will trigger email sending immediately)
      to: [userProfile.email],
      sendGrid: {
        templateId: "d-a6b05232823142619e447d18f23e0d42", // SendGrid Dynamic Template ID
        dynamicTemplateData: generateSendGridTemplateData(
          `${userProfile.firstName} ${userProfile.lastName}`,
          invoiceId,
          summary
        ),
      },

      // PDF Extension metadata (not passed to template)
      output: {
        location: `invoices`, // Folder in Firebase Storage
        name: `${invoiceId}.pdf`, // PDF filename matches document ID
      }, // Additional metadata for our app (not passed to template)
      userId,
      createdAt: now, // Keep as Date for Firestore
    }); // Clear the user's cart after successful checkout
    const clearResult = await clearCart();
    if (!clearResult.success) {
      console.warn("Failed to clear cart after checkout:", clearResult.error);
    }
    return {
      success: true,
      invoiceId: invoiceId,
      invoiceNumber: invoiceId, // Use the same ID
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
 * Gets invoice status by ID - always returns completed since PDFs are generated immediately
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
    } // Serialize the invoice data to handle Firebase Timestamps
    const serializedInvoiceData = serializeFirestoreData(invoiceData);
    return {
      success: true,
      invoice: {
        status: "completed", // Always completed since we create PDFs immediately
        downloadURL: `https://storage.googleapis.com/gtours-fcd56.firebasestorage.app/invoices/${invoiceId}.pdf`, // Direct PDF link
        data: {
          invoiceNumber: serializedInvoiceData?.invoiceNumber,
          invoiceDate: serializedInvoiceData?.invoiceDate,
          customer: serializedInvoiceData?.customer,
          summary: serializedInvoiceData?.summary,
          tourDetails: serializedInvoiceData?.tourDetails,
        },
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

/**
 * Generates SendGrid template data for invoice notification
 */
function generateSendGridTemplateData(
  customerName: string,
  invoiceId: string,
  summary: any
): any {
  const pdfDownloadUrl = `https://storage.googleapis.com/gtours-fcd56.firebasestorage.app/invoices/${invoiceId}.pdf`;

  return {
    customerName,
    invoiceId,
    startDate: summary.startDate, // This is now a formatted string like "25/5/2025"
    pdfDownloadUrl,
    totalPrice: summary.totalPrice,
    currency: summary.currency,
    tours: summary.tours,
    tourists: summary.tourists,
  };
}
