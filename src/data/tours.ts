import "server-only";
import { firestore, getTotalPages } from "../firebase/server";
import { Tour } from "@/types/Tour";

type getToursOptions = {
  filters?: {
    minPrice?: number | null;
    maxPrice?: number | null;
    // TODO
  };
  pagination?: {
    page?: number;
    pageSize?: number;
  };
};

// Helper function to migrate old tour data structure to new array structure
function migrateTourData(data: any): Partial<Tour> {
  // Helper function to migrate activity descriptions
  const migrateActivities = (activities: any[]) => {
    return activities.map(activity => ({
      ...activity,
      specificDescription: Array.isArray(activity.specificDescription)
        ? activity.specificDescription
        : [activity.specificDescription || "", "", ""] // Convert old string to array
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
  const { minPrice, maxPrice } = options?.filters || {};

  let toursQuery = firestore.collection("tours").orderBy("basePrice", "desc");

  if (minPrice !== null && minPrice !== undefined) {
    toursQuery = toursQuery.where("basePrice", ">=", minPrice);
  }
  if (maxPrice !== null && maxPrice !== undefined) {
    toursQuery = toursQuery.where("basePrice", "<=", maxPrice);
  }

  const totalPages = await getTotalPages(toursQuery, pageSize);
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
