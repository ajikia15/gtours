"use server";
import { tourDataSchema } from "@/validation/tourSchema";
import { z } from "zod";
import { auth, firestore } from "@/firebase/server";
import { Tour, TourWithId } from "@/types/Tour";

export const saveNewTour = async (
  data: z.infer<typeof tourDataSchema>,
  token: string
) => {
  const docRef = firestore.collection("tours").doc();

  const verifiedToken = await auth.verifyIdToken(token);
  if (!verifiedToken.admin) {
    return {
      error: "Unauthorized",
      message: "You are not privileged to save a new tour",
    };
  }

  const validation = tourDataSchema.safeParse(data);

  if (!validation.success) {
    return {
      error: "Invalid data",
      message: "Please check your data and try again",
    };
  }
  const tour = await firestore.collection("tours").add({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return {
    tourId: tour.id,
    success: "Tour saved successfully",
    message: "Tour saved successfully",
  };
};

export const editTour = async (
  data: z.infer<typeof tourDataSchema>,
  id: string,
  token: string
) => {
  const verifiedToken = await auth.verifyIdToken(token);
  if (!verifiedToken.admin) {
    return {
      error: "Unauthorized",
      message: "You are not privileged to save a new tour",
    };
  }

  const validation = tourDataSchema.safeParse(data);

  if (!validation.success) {
    return {
      error: "Invalid data",
      message: "Please check your data and try again",
    };
  }

  await firestore
    .collection("tours")
    .doc(id)
    .update({
      ...data,
      updatedAt: new Date(),
    });
};

export const saveTourImages = async (
  {
    tourId,
    images,
  }: {
    tourId: string;
    images: string[];
  },
  token: string
) => {
  const verifiedToken = await auth.verifyIdToken(token);
  if (!verifiedToken.admin) {
    return {
      error: "Unauthorized",
      message: "You are not privileged to save a new tour",
    };
  }

  const schema = z.object({
    tourId: z.string(),
    images: z.array(z.string()),
  });

  const validation = schema.safeParse({ tourId, images });
  if (!validation.success) {
    return {
      error: "Invalid data",
      message: "Please check your data and try again",
    };
  }
  await firestore.collection("tours").doc(tourId).update({
    images,
  });
};
