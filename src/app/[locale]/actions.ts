"use server";

import { auth, firestore } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

export const addFavourite = async (tourId: string, authToken: string) => {
  try {
    const verifiedToken = await auth.verifyIdToken(authToken);
    if (!verifiedToken) {
      return {
        error: true,
        message: "Unauthorized",
      };
    }

    await firestore
      .collection("favourites")
      .doc(verifiedToken.uid)
      .set(
        {
          [tourId]: true,
        },
        {
          merge: true,
        }
      );
  } catch (error) {
    console.error("Error in addFavourite:", error);
    return {
      error: true,
      message: "Invalid or expired token",
    };
  }
};

export const removeFavourite = async (tourId: string, authToken: string) => {
  try {
    const verifiedToken = await auth.verifyIdToken(authToken);
    if (!verifiedToken) {
      return {
        error: true,
        message: "Unauthorized",
      };
    }

    await firestore
      .collection("favourites")
      .doc(verifiedToken.uid)
      .update({
        [tourId]: FieldValue.delete(),
      });
  } catch (error) {
    console.error("Error in removeFavourite:", error);
    return {
      error: true,
      message: "Invalid or expired token",
    };
  }
};
