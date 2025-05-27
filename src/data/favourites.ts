import { firestore } from "@/firebase/server";
import { verifyUserToken } from "@/lib/auth-utils";
import "server-only";

export const getUserFavourites = async () => {
  try {
    const verifiedToken = await verifyUserToken();
    const favouritesSnapshot = await firestore
      .collection("favourites")
      .doc(verifiedToken.uid)
      .get();

    const favouritesData = favouritesSnapshot.data();
    return favouritesData || {};
  } catch (error) {
    // Token validation failed, return empty favourites
    // Middleware will handle token clearing and redirects
    console.warn(
      "No valid token found for getUserFavourites, returning empty favourites"
    );
    return {};
  }
};
