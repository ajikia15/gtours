import { getCurrentUserToken } from "@/lib/auth-utils";
import { firestore } from "@/firebase/server";
import "server-only";

export const getUserFavourites = async (): Promise<string[]> => {
  try {
    const verifiedToken = await getCurrentUserToken();

    // If user is not logged in, return empty array (no favorites)
    if (!verifiedToken) {
      return [];
    }

    const favouritesDoc = await firestore
      .collection("favourites")
      .doc(verifiedToken.uid)
      .get();

    if (!favouritesDoc.exists) {
      return [];
    }

    const data = favouritesDoc.data();
    return data?.tourIds || [];
  } catch (error) {
    console.error("Error getting user favourites:", error);
    return [];
  }
};
