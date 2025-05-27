"use server";

import { firestore } from "@/firebase/server";
import { verifyUserToken } from "@/lib/auth-utils";
import { UserProfile } from "@/types/User";

/**
 * Creates or updates a user profile in Firestore
 */
export const saveUserProfile = async (
  profileData: Partial<UserProfile>,
  authToken?: string
) => {
  try {
    const verifiedToken = await verifyUserToken(authToken);
    const userId = verifiedToken.uid;

    // Get existing profile to preserve certain fields
    const existingProfile = await getUserProfile(authToken);

    const profileToSave: Partial<UserProfile> = {
      ...profileData,
      uid: userId,
      updatedAt: new Date(),
    };

    // Only include email if it exists
    if (verifiedToken.email) {
      profileToSave.email = verifiedToken.email;
    }

    // If this is a new profile, set createdAt
    if (!existingProfile) {
      profileToSave.createdAt = new Date();
    }

    await firestore
      .collection("userProfiles")
      .doc(userId)
      .set(profileToSave, { merge: true });

    return { success: true };
  } catch (error) {
    console.error("Error saving user profile:", error);
    return {
      error: true,
      message:
        error instanceof Error ? error.message : "Failed to save profile",
    };
  }
};

/**
 * Retrieves a user profile from Firestore
 */
export const getUserProfile = async (
  authToken?: string
): Promise<UserProfile | null> => {
  try {
    const verifiedToken = await verifyUserToken(authToken);
    const userId = verifiedToken.uid;

    const profileDoc = await firestore
      .collection("userProfiles")
      .doc(userId)
      .get();

    if (!profileDoc.exists) {
      return null;
    }

    const data = profileDoc.data();
    return {
      ...data,
      createdAt: data?.createdAt?.toDate(),
      updatedAt: data?.updatedAt?.toDate(),
    } as UserProfile;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
};

/**
 * Checks if a user has completed their profile
 */
export const isProfileComplete = async (
  authToken?: string
): Promise<boolean> => {
  const profile = await getUserProfile(authToken);

  if (!profile) return false;

  return !!(
    profile.firstName &&
    profile.lastName &&
    profile.phoneNumber &&
    profile.phoneVerified
  );
};
