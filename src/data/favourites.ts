import { auth, firestore } from "@/firebase/server";
import { cookies } from "next/headers";
import "server-only";

const clearInvalidToken = async () => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("firebaseAuthToken");
    cookieStore.delete("firebaseAuthRefreshToken");
    console.log("Cleared invalid tokens from cookies");
  } catch (error) {
    console.error("Error clearing invalid tokens:", error);
  }
};

export const getUserFavourites = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("firebaseAuthToken");

  if (!token) {
    return {};
  }

  // Basic JWT format validation (should have 3 parts separated by dots)
  if (
    !token.value ||
    typeof token.value !== "string" ||
    token.value.split(".").length !== 3
  ) {
    console.warn("Invalid token format in getUserFavourites, clearing token");
    return {};
  }

  try {
    const verifiedToken = await auth.verifyIdToken(token.value);
    if (!verifiedToken) {
      return {};
    }
    const favouritesSnapshot = await firestore
      .collection("favourites")
      .doc(verifiedToken.uid)
      .get();

    const favouritesData = favouritesSnapshot.data();
    return favouritesData || {};
  } catch (error) {
    // Token is invalid/expired, return empty favourites
    console.error("Error verifying token in getUserFavourites:", {
      error: error instanceof Error ? error.message : error,
      tokenExists: !!token.value,
      tokenLength: token.value?.length || 0,
      tokenPreview: token.value?.substring(0, 20) + "..." || "no token",
    });
    return {};
  }
};
