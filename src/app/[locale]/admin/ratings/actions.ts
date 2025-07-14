"use server";
import { ratingSchema } from "@/validation/ratingSchema";
import { z } from "zod";
import { firestore } from "@/firebase/server";
import { verifyAdminToken } from "@/lib/auth-utils";
import { revalidateTag } from "next/cache";

export const saveNewRating = async (
  data: z.infer<typeof ratingSchema>,
  token: string
) => {
  try {
    await verifyAdminToken(token);
  } catch (error) {
    console.error("Error verifying admin token in saveNewRating:", error);
    return {
      error: "Unauthorized",
      message:
        error instanceof Error
          ? error.message
          : "Invalid or expired authentication token",
    };
  }

  const validation = ratingSchema.safeParse(data);

  if (!validation.success) {
    return {
      error: "Invalid data",
      message: "Please check your data and try again",
    };
  }
  const rating = await firestore.collection("ratings").add({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  
  // Revalidate cache
  revalidateTag("ratings");
  revalidateTag("active-ratings");
  
  return {
    ratingId: rating.id,
    success: "Rating saved successfully",
    message: "Rating saved successfully",
  };
};

export const editRating = async (
  data: z.infer<typeof ratingSchema>,
  id: string,
  token: string
) => {
  try {
    await verifyAdminToken(token);
  } catch (error) {
    console.error("Error verifying admin token in editRating:", error);
    return {
      error: "Unauthorized",
      message:
        error instanceof Error
          ? error.message
          : "Invalid or expired authentication token",
    };
  }

  const validation = ratingSchema.safeParse(data);

  if (!validation.success) {
    return {
      error: "Invalid data",
      message: "Please check your data and try again",
    };
  }

  try {
    await firestore.collection("ratings").doc(id).update({
      ...data,
      updatedAt: new Date(),
    });
    
    // Revalidate cache
    revalidateTag("ratings");
    revalidateTag("active-ratings");
    revalidateTag("rating");
    
    return {
      success: "Rating updated successfully",
      message: "Rating updated successfully",
    };
  } catch (error) {
    console.error("Error updating rating:", error);
    return {
      error: "Failed to update rating",
      message: "An error occurred while updating the rating",
    };
  }
};

export const deleteRating = async (id: string, token: string) => {
  try {
    await verifyAdminToken(token);
  } catch (error) {
    console.error("Error verifying admin token in deleteRating:", error);
    return {
      error: "Unauthorized",
      message:
        error instanceof Error
          ? error.message
          : "Invalid or expired authentication token",
    };
  }

  try {
    await firestore.collection("ratings").doc(id).delete();
    
    // Revalidate cache
    revalidateTag("ratings");
    revalidateTag("active-ratings");
    revalidateTag("rating");
    
    return {
      success: "Rating deleted successfully",
      message: "Rating deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting rating:", error);
    return {
      error: "Failed to delete rating",
      message: "An error occurred while deleting the rating",
    };
  }
};
