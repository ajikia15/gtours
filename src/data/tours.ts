import "server-only";
import { firestore, getTotalPages } from "../firebase/server";
import { Tour } from "@/types/Tour";
import { unstable_cache } from "next/cache";

type getToursOptions = {
  filters?: {
    minPrice?: number | null;
    maxPrice?: number | null;
    status?: "active" | "disabled" | "draft"; // Add status filter
  };
  pagination?: {
    page?: number;
    pageSize?: number;
  };
  sorting?: {
    sortBy?: "price" | "alphabetical";
    sortOrder?: "asc" | "desc";
  };
};

// Helper function to migrate old tour data structure to new array structure
function migrateTourData(data: any): Partial<Tour> {
  // Helper function to migrate activity descriptions
  const migrateActivities = (activities: any[]) => {
    return activities.map((activity) => ({
      ...activity,
      specificDescription: Array.isArray(activity.specificDescription)
        ? activity.specificDescription
        : [activity.specificDescription || "", "", ""], // Convert old string to array
    }));
  };

  // Check if data is already in new format (arrays)
  if (Array.isArray(data?.title)) {
    return {
      title: data.title || ["", "", ""],
      subtitle: data.subtitle || ["", "", ""],
      description: data.description || ["", "", ""],
      basePrice: data.basePrice || 0,
      duration: data.duration || 0,
      leaveTime: data.leaveTime || "",
      returnTime: data.returnTime || "",
      coordinates: data.coordinates || undefined,
      status: data.status || "draft",
      images: data.images || [],
      offeredActivities: migrateActivities(data.offeredActivities || []),
    };
  }

  // Convert old format to new format
  return {
    title: [
      data?.title || data?.titleEN || "",
      data?.titleGE || "",
      data?.titleRU || "",
    ],
    subtitle: [
      data?.subtitleEN || "",
      data?.subtitleGE || "",
      data?.subtitleRU || "",
    ],
    description: [
      data?.descriptionEN || "",
      data?.descriptionGE || "",
      data?.descriptionRU || "",
    ],
    basePrice: data?.basePrice || 0,
    duration: data?.duration || 0,
    leaveTime: data?.leaveTime || "",
    returnTime: data?.returnTime || "",
    coordinates: data?.coordinates || undefined,
    status: data?.status || "draft",
    images: data?.images || [],
    offeredActivities: migrateActivities(data?.offeredActivities || []),
  };
}

export async function getTours(options?: getToursOptions) {
  const page = options?.pagination?.page || 1;
  const pageSize = options?.pagination?.pageSize || 10;
  const { minPrice, maxPrice, status } = options?.filters || {};
  const { sortBy, sortOrder } = options?.sorting || {};

  // Build the query with sorting
  let orderBy: string;
  let orderDirection: "asc" | "desc";

  if (sortBy === "alphabetical") {
    orderBy = "title";
    orderDirection = sortOrder || "asc";
  } else {
    // Default to price sorting
    orderBy = "basePrice";
    orderDirection = sortOrder || "desc";
  }

  let toursQuery = firestore
    .collection("tours")
    .orderBy(orderBy, orderDirection);

  // Add filters
  if (status) {
    toursQuery = toursQuery.where("status", "==", status);
  }

  if (minPrice !== null && minPrice !== undefined) {
    toursQuery = toursQuery.where("basePrice", ">=", minPrice);
  }
  if (maxPrice !== null && maxPrice !== undefined) {
    toursQuery = toursQuery.where("basePrice", "<=", maxPrice);
  }

  // Get tours data first (this is fast)
  const toursSnapshot = await toursQuery
    .limit(pageSize)
    .offset((page - 1) * pageSize)
    .get();

  const tours = toursSnapshot.docs.map((doc) => {
    const data = doc.data();
    const migratedData = migrateTourData(data);
    return {
      id: doc.id,
      ...migratedData,
    };
  }) as Tour[];

  // Only calculate total pages if specifically needed (adds ~2s delay)
  let totalPages = 1;
  if (options?.pagination?.page && options.pagination.page > 1) {
    // Only do expensive count query for pagination beyond first page
    totalPages = await getTotalPages(toursQuery, pageSize);
  } else if (tours.length === pageSize) {
    // If we got a full page, there's probably more - estimate
    totalPages = page + 1;
  }

  return { data: tours, totalPages };
}

export async function getTourById(tourId: string) {
  const tour = await firestore.collection("tours").doc(tourId).get();
  const tourData = tour.data();

  const migratedData = migrateTourData(tourData);

  // Create a clean, serializable version of the tour data
  const serializedTour = {
    id: tour.id,
    ...migratedData,
  };

  return serializedTour as Tour;
}

export async function getToursById(tourIds: string[]) {
  const tours = await firestore
    .collection("tours")
    .where("__name__", "in", tourIds)
    .get();
  return tours.docs.map((doc) => {
    const data = doc.data();
    const migratedData = migrateTourData(data);
    return {
      id: doc.id,
      ...migratedData,
    };
  }) as Tour[];
}

/**
 * Get published tours (only filtering by status in Firestore, sorting handled client-side)
 */
async function _getPublishedTours() {
  try {
    // Simple query - only filter by status to get published tours
    const toursQuery = firestore
      .collection("tours")
      .where("status", "==", "active"); // Only published/active tours

    // Get all published tours
    const toursSnapshot = await toursQuery.get();

    const tours = toursSnapshot.docs.map((doc) => {
      const data = doc.data();
      const migratedData = migrateTourData(data);
      return {
        id: doc.id,
        ...migratedData,
      };
    }) as Tour[];

    return { data: tours, error: null };
  } catch (error) {
    console.error("Error fetching published tours:", error);
    return {
      data: [],
      error: error instanceof Error ? error.message : "Failed to fetch tours",
    };
  }
}

// Cache the published tours for better performance
export const getPublishedTours = unstable_cache(
  _getPublishedTours,
  ["published-tours"],
  {
    revalidate: 300, // Revalidate every 5 minutes
    tags: ["tours"],
  }
);
