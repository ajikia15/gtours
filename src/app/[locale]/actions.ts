"use server";

import { auth, firestore } from "@/firebase/server";

export const addFavourite = async (tourId: string, authToken: string) => {
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
};
