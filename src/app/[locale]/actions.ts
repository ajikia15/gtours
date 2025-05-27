"use server";

import { firestore } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";
import { verifyUserToken } from "@/lib/auth-utils";

export const addFavourite = async (tourId: string, authToken: string) => {
  try {
    const verifiedToken = await verifyUserToken(authToken);

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
      message:
        error instanceof Error ? error.message : "Invalid or expired token",
    };
  }
};

export const removeFavourite = async (tourId: string, authToken: string) => {
  try {
    const verifiedToken = await verifyUserToken(authToken);

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
      message:
        error instanceof Error ? error.message : "Invalid or expired token",
    };
  }
};
