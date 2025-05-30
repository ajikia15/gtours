"use server";

import { firestore } from "@/firebase/server";
import { requireUserAuth } from "@/lib/auth-utils";

export const addFavourite = async (tourId: string, authToken: string) => {
  try {
    const verifiedToken = await requireUserAuth(authToken);

    const favouritesRef = firestore
      .collection("favourites")
      .doc(verifiedToken.uid);

    const doc = await favouritesRef.get();
    const currentFavourites = doc.exists ? doc.data()?.tourIds || [] : [];

    if (!currentFavourites.includes(tourId)) {
      await favouritesRef.set(
        {
          tourIds: [...currentFavourites, tourId],
          updatedAt: new Date(),
        },
        { merge: true }
      );
    }

    return { success: true };
  } catch (e) {
    console.error("Error adding favourite:", e);
    return { error: "Failed to add favourite" };
  }
};

export const removeFavourite = async (tourId: string, authToken: string) => {
  try {
    const verifiedToken = await requireUserAuth(authToken);

    const favouritesRef = firestore
      .collection("favourites")
      .doc(verifiedToken.uid);

    const doc = await favouritesRef.get();
    const currentFavourites = doc.exists ? doc.data()?.tourIds || [] : [];

    const updatedFavourites = currentFavourites.filter(
      (id: string) => id !== tourId
    );

    await favouritesRef.set(
      {
        tourIds: updatedFavourites,
        updatedAt: new Date(),
      },
      { merge: true }
    );

    return { success: true };
  } catch (e) {
    console.error("Error removing favourite:", e);
    return { error: "Failed to remove favourite" };
  }
};
