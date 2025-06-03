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
 * The template name is not specified dynamically but is configure            <div className="invoice-info">
                <h3>📄 Invoice Details</h3>
                <p><strong>Invoice ID:</strong> ${invoiceNumber}</p>
                <p><strong>Status:</strong> Ready for Download</p>
                <p><strong>Expected Guest Date:</strong> ${summary.startDate}</p>
            </div>the extension settings.
 */

import { firestore } from "@/firebase/server";
import { requireUserAuth } from "@/lib/auth-utils";
import { CartItem } from "@/types/Cart";
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
 * Email extension looks for "to" and "message" fields to send emails.
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
  };  tourDetails: {
    tourTitle: string;
    selectedDate: string;
    travelers: string;
    activities: string[];
    price: number;
  }[];

  // Email Extension fields (will trigger email sending)
  to: string[];
  message: {
    subject: string;
    text: string;
    html: string;
  };

  // PDF Extension required fields
  output: {
    location: string;
    name: string;
  };
  status?: "pending" | "processing" | "completed" | "error";
  downloadURL?: string;
  createdAt?: Date;
  completedAt?: Date;
  error?: string;

  // Our custom metadata fields
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
    }    const now = new Date();
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
    }));    // Create the invoice document with the structure expected by the PDF extension
    // PDFPlum passes the entire document (except _pdfplum_config) to Handlebars
    // Since PDFs are stored as {documentId}.pdf, we can generate the document first,
    // then use its ID for the email content
    const tempInvoiceDoc = await firestore.collection("invoices").doc();
    const invoiceId = tempInvoiceDoc.id;

    await tempInvoiceDoc.set({
      // Template data at root level for Handlebars (these become {{variableName}})
      invoiceNumber: invoiceId, // Use document ID as invoice number
      invoiceDate: now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      customer: {
        name: `${userProfile.firstName} ${userProfile.lastName}`,
        email: userProfile.email,
        phone: userProfile.phoneNumber || undefined, // undefined removes the field
      },
      summary,
      tourDetails,

      // Email Extension fields (will trigger email sending immediately)
      to: [userProfile.email],
      message: {
        subject: `Your Georgia Tours Invoice - ${invoiceId}`,        html: generateInvoiceEmailHtml(
          `${userProfile.firstName} ${userProfile.lastName}`,
          invoiceId,
          invoiceId, // Use the actual document ID
          summary // Pass summary for guest date
        ),
        text: generateInvoiceEmailText(
          `${userProfile.firstName} ${userProfile.lastName}`,
          invoiceId,
          invoiceId, // Use the actual document ID
          summary // Pass summary for guest date
        ),
      },

      // PDF Extension metadata (not passed to template)
      output: {
        location: `invoices`, // Folder in Firebase Storage
        name: `${invoiceId}.pdf`, // PDF filename matches document ID
      },

      // Additional metadata for our app (not passed to template)
      userId,
      userEmail,
      orderItems: cartResult.cart,
      createdAt: now,
    });// Clear the user's cart after successful checkout
    const clearResult = await clearCart();
    if (!clearResult.success) {
      console.warn("Failed to clear cart after checkout:", clearResult.error);
    }    return {
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
    }    // Serialize the invoice data to handle Firebase Timestamps
    const serializedInvoiceData = serializeFirestoreData(invoiceData);    return {
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
        error: invoiceData.error, // Keep error handling if needed
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
 * Generates HTML email content for invoice notification
 */
function generateInvoiceEmailHtml(
  customerName: string,
  invoiceNumber: string,
  invoiceId: string,
  summary: any
): string {
  // Direct link to PDF in Firebase Storage
  const pdfDownloadUrl = `https://storage.googleapis.com/gtours-fcd56.firebasestorage.app/invoices/${invoiceId}.pdf`;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Georgia Tours Invoice</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9fafb;
        }
        .email-container {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0 0 10px 0;
            font-size: 28px;
            font-weight: bold;
        }
        .header p {
            margin: 0;
            font-size: 16px;
            opacity: 0.9;
        }
        .content {
            padding: 40px 30px;
        }
        .content h2 {
            color: #1f2937;
            margin: 0 0 20px 0;
            font-size: 24px;
        }
        .invoice-info {
            background: #f3f4f6;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #dc2626;
        }
        .invoice-info h3 {
            margin: 0 0 10px 0;
            color: #dc2626;
            font-size: 18px;
        }
        .download-section {
            text-align: center;
            margin: 30px 0;
            padding: 25px;
            background: #fef2f2;
            border-radius: 8px;
            border: 1px solid #fecaca;
        }
        .download-button {
            display: inline-block;
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            margin: 10px 0;
            box-shadow: 0 2px 4px rgba(220, 38, 38, 0.2);
            transition: all 0.3s ease;
        }
        .download-button:hover {
            background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
            transform: translateY(-1px);
        }
        .note {
            background: #fffbeb;
            border: 1px solid #fed7aa;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            color: #92400e;
        }
        .footer {
            background: #f9fafb;
            padding: 30px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
            border-top: 1px solid #e5e7eb;
        }
        .footer p {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>🏔️ Georgia Tours</h1>
            <p>Your Georgian Adventure Awaits</p>
        </div>
        
        <div class="content">
            <h2>Hello ${customerName}!</h2>
            
            <p>Thank you for booking with Georgia Tours! Your invoice has been generated and is ready for download.</p>
              <div class="invoice-info">
                <h3>📄 Invoice Details</h3>
                <p><strong>Invoice ID:</strong> ${invoiceNumber}</p>
                <p><strong>Status:</strong> Ready for Download</p>
                <p><strong>Expected Guest Date:</strong> ${summary.startDate}</p>
            </div>
            
            <div class="download-section">
                <p><strong>Your invoice PDF is ready!</strong></p>
                <a href="${pdfDownloadUrl}" class="download-button">📥 Download Invoice PDF</a>
                <p style="font-size: 14px; color: #6b7280; margin-top: 15px;">Click the button above to download your invoice</p>
            </div>
              <div class="note">
                <p><strong>📝 Note:</strong> If the PDF download doesn't work immediately, please wait a few minutes for the file to be fully processed, then try again.</p>
                <p><strong>📧 Important:</strong> If you don't see this email in your inbox, please check your spam/junk folder. Sometimes emails with attachments or download links may be filtered.</p>
            </div>
            
            <p>We're excited to help you explore the beautiful country of Georgia. If you have any questions about your booking, please don't hesitate to contact us.</p>
            
            <p>Best regards,<br>
            <strong>The Georgia Tours Team</strong></p>
        </div>
        
        <div class="footer">
            <p><strong>Georgia Tours</strong> | Email: info@georgiatours.ge</p>
            <p>This is an automated email. Please do not reply to this message.</p>
        </div>
    </div>
</body>
</html>
  `.trim();
}

/**
 * Generates plain text email content for invoice notification
 */
function generateInvoiceEmailText(
  customerName: string,
  invoiceNumber: string,
  invoiceId: string,
  summary: any
): string {
  // Direct link to PDF download
  const pdfDownloadUrl = `https://storage.googleapis.com/gtours-fcd56.firebasestorage.app/invoices/${invoiceId}.pdf`;
  
  return `
🏔️ GEORGIA TOURS - Invoice Ready

Hello ${customerName}!

Thank you for booking with Georgia Tours! Your invoice has been generated and is ready for download.

📄 INVOICE DETAILS:
- Invoice ID: ${invoiceNumber}
- Status: Ready for Download
- Expected Guest Date: ${summary.startDate}

📥 DOWNLOAD YOUR INVOICE:
${pdfDownloadUrl}

📝 Note: If the PDF download doesn't work immediately, please wait a few minutes for the file to be fully processed, then try again.

📧 Important: If you don't see this email in your inbox, please check your spam/junk folder. Sometimes emails with attachments or download links may be filtered.

We're excited to help you explore the beautiful country of Georgia. If you have any questions about your booking, please don't hesitate to contact us.

Best regards,
The Georgia Tours Team

---
Georgia Tours | Email: info@georgiatours.ge
This is an automated email. Please do not reply to this message.
  `.trim();
}
