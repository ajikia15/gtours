"use server";
import { tourDataSchema } from "@/validation/tourSchema";
import { z } from "zod";
import { auth, firestore } from "../../../../../firebase/server";

export const saveNewTour = async (
  data: z.infer<typeof tourDataSchema>,
  token: string
) => {
  console.log("Running");
  const docRef = firestore.collection("tours").doc();
  await docRef.set({
    price: 100,
  });
  console.log("Done");

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
  });
  return {
    tourId: tour.id,
    success: "Tour saved successfully",
    message: "Tour saved successfully",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
