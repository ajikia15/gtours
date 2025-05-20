import "server-only";
import { firestore, getTotalPages } from "../firebase/server";
import { Tour, TourWithId } from "@/types/Tour";

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
export async function getTours(options: getToursOptions) {
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

  const tours = toursSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as TourWithId[];
  return { data: tours, totalPages };
}
export async function getTourById(tourId: string) {
  const tour = await firestore.collection("tours").doc(tourId).get();
  const tourData = {
    id: tour.id,
    ...tour.data(),
  };
  return tourData as TourWithId;
}
