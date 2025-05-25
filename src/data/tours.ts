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
    return {
      id: doc.id,
      title: data?.title || "",
      descriptionEN: data?.descriptionEN || "",
      descriptionGE: data?.descriptionGE || "",
      descriptionRU: data?.descriptionRU || "",
      basePrice: data?.basePrice || 0,
      duration: data?.duration || 0,
      leaveTime: data?.leaveTime || "",
      returnTime: data?.returnTime || "",
      coordinates: data?.coordinates || undefined,
      status: data?.status || "draft",
      images: data?.images || [],
      offeredActivities: data?.offeredActivities || [],
    };
  }) as Tour[];
  return { data: tours, totalPages };
}
export async function getTourById(tourId: string) {
  const tour = await firestore.collection("tours").doc(tourId).get();
  const tourData = tour.data();

  // Create a clean, serializable version of the tour data
  const serializedTour = {
    id: tour.id,
    title: tourData?.title || "",
    descriptionEN: tourData?.descriptionEN || "",
    descriptionGE: tourData?.descriptionGE || "",
    descriptionRU: tourData?.descriptionRU || "",
    basePrice: tourData?.basePrice || 0,
    duration: tourData?.duration || 0,
    leaveTime: tourData?.leaveTime || "",
    returnTime: tourData?.returnTime || "",
    coordinates: tourData?.coordinates || undefined,
    status: tourData?.status || "draft",
    images: tourData?.images || [],
    offeredActivities: tourData?.offeredActivities || [],
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
    return {
      id: doc.id,
      title: data?.title || "",
      descriptionEN: data?.descriptionEN || "",
      descriptionGE: data?.descriptionGE || "",
      descriptionRU: data?.descriptionRU || "",
      basePrice: data?.basePrice || 0,
      duration: data?.duration || 0,
      leaveTime: data?.leaveTime || "",
      returnTime: data?.returnTime || "",
      coordinates: data?.coordinates || undefined,
      status: data?.status || "draft",
      images: data?.images || [],
      offeredActivities: data?.offeredActivities || [],
    };
  }) as Tour[];
}
