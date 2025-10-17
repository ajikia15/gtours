"use server";
import { tourDataSchema } from "@/validation/tourSchema";
import { firestore } from "@/firebase/server";
import { verifyAdminToken } from "@/lib/auth-utils";
import { z } from "zod";

export const saveNewTour = async (
  data: z.infer<typeof tourDataSchema>,
  token: string
) => {
  try {
    await verifyAdminToken(token);
  } catch (error) {
    console.error("Error verifying admin token in saveNewTour:", error);
    return {
      error: "Unauthorized",
      message:
        error instanceof Error
          ? error.message
          : "Invalid or expired authentication token",
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
  try {
    await verifyAdminToken(token);
  } catch (error) {
    console.error("Error verifying admin token in editTour:", error);
    return {
      error: "Unauthorized",
      message:
        error instanceof Error
          ? error.message
          : "Invalid or expired authentication token",
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
  try {
    await verifyAdminToken(token);
  } catch (error) {
    console.error("Error verifying admin token in saveTourImages:", error);
    return {
      error: "Unauthorized",
      message:
        error instanceof Error
          ? error.message
          : "Invalid or expired authentication token",
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

export const deleteTour = async (id: string, token: string) => {
  try {
    await verifyAdminToken(token);
  } catch (error) {
    console.error("Error verifying admin token in deleteTour:", error);
    return {
      error: "Unauthorized",
      message:
        error instanceof Error
          ? error.message
          : "Invalid or expired authentication token",
    };
  }

  try {
    await firestore.collection("tours").doc(id).delete();
    return {
      success: "Tour deleted successfully",
      message: "Tour deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting tour:", error);
    return {
      error: "Failed to delete tour",
      message: "An error occurred while deleting the tour",
    };
  }
};
