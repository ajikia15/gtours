import "server-only";
import { firestore } from "./server";

export type Tour = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  basePrice: number;
  duration?: number;
  leaveTime?: string;
  returnTime?: string;
  location?: string;
  isActive?: boolean;
  updatedAt?: Date;
};

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
  const toursSnapshot = await toursQuery
    .limit(pageSize)
    .offset((page - 1) * pageSize)
    .get();

  const tours = toursSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Tour[];
  return { data: tours };
}
