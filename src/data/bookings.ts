"use server";

import { firestore, getTotalPages } from "@/firebase/server";
import { InvoiceDocument } from "@/data/checkout";
import { revalidatePath } from "next/cache";

export type Booking = InvoiceDocument & { id: string };

type GetBookingsOptions = {
  pagination?: {
    page?: number;
    pageSize?: number;
  };
  sorting?: {
    sortBy?: "date" | "amount";
    sortOrder?: "asc" | "desc";
  };
  filters?: {
    status?: "pending" | "confirmed" | "completed" | "cancelled";
  };
};

export async function getAllBookings(options?: GetBookingsOptions) {
  try {
    const page = options?.pagination?.page || 1;
    const pageSize = options?.pagination?.pageSize || 10;
    const { sortBy, sortOrder } = options?.sorting || {};
    const { status } = options?.filters || {};

    let query: FirebaseFirestore.Query = firestore.collection("invoices");

    if (status) {
      query = query.where("status", "==", status);
    }

    let orderByField = "createdAt";
    if (sortBy === "amount") {
      orderByField = "summary.totalPrice";
    } else if (sortBy === "date") {
      orderByField = "createdAt";
    }

    const direction = sortOrder || "desc";

    query = query.orderBy(orderByField, direction);

    const totalPages = await getTotalPages(query, pageSize);

    const snapshot = await query
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .get();

    const bookings: Booking[] = snapshot.docs.map((doc) => {
      const data = doc.data();

      // Helper to serialize Firestore data (convert Timestamps to Dates)
      const serialize = (obj: any): any => {
        if (!obj) return obj;

        // Handle Firestore Timestamp
        if (typeof obj.toDate === "function") {
          return obj.toDate();
        }

        // Handle raw Timestamp object
        if (
          typeof obj === "object" &&
          "_seconds" in obj &&
          "_nanoseconds" in obj
        ) {
          return new Date(obj._seconds * 1000 + obj._nanoseconds / 1000000);
        }

        if (Array.isArray(obj)) {
          return obj.map(serialize);
        }

        if (typeof obj === "object") {
          const result: any = {};
          for (const key in obj) {
            result[key] = serialize(obj[key]);
          }
          return result;
        }

        return obj;
      };

      const serializedData = serialize(data);

      return {
        ...serializedData,
        id: doc.id,
        // Ensure createdAt is a Date (it should be handled by serialize, but just in case)
        createdAt:
          serializedData.createdAt instanceof Date
            ? serializedData.createdAt
            : new Date(serializedData.createdAt || serializedData.invoiceDate),
        // Default status if missing (legacy data)
        status: serializedData.status || "completed",
      };
    });

    return {
      data: bookings,
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching bookings:", error);
    // Return empty data on error to prevent UI crash
    return {
      data: [],
      totalPages: 0,
      error: "Failed to fetch bookings. Please check database indexes.",
    };
  }
}

export async function deleteBooking(bookingId: string) {
  try {
    await firestore.collection("invoices").doc(bookingId).delete();
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting booking:", error);
    return { success: false, error };
  }
}

export async function updateBookingStatus(
  bookingId: string,
  status: Booking["status"]
) {
  try {
    await firestore.collection("invoices").doc(bookingId).update({
      status,
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error updating booking status:", error);
    return { success: false, error };
  }
}
