import "server-only";
import { firestore } from "./server";

export type Tour = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
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

  let toursQuery = firestore.collection("tours").orderBy("price", "desc");

  if (minPrice !== null && minPrice !== undefined) {
    toursQuery = toursQuery.where("price", ">=", minPrice);
  }
  if (maxPrice !== null && maxPrice !== undefined) {
    toursQuery = toursQuery.where("price", "<=", maxPrice);
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
