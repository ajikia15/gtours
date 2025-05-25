"use server";

import { cookies } from "next/headers";
import { auth } from "../firebase/server";
export const removeToken = async () => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("firebaseAuthToken");
    cookieStore.delete("firebaseAuthRefreshToken");
  } catch (error) {
    console.error("Error removing tokens:", error);
  }
};
export const setToken = async ({
  token,
  refreshToken,
}: {
  token: string;
  refreshToken: string;
}) => {
  try {
    if (refreshToken) {
      console.log("");
    }

    const verifiedToken = await auth.verifyIdToken(token);
    if (!verifiedToken) {
      throw new Error("Invalid token");
    }
    const userRecord = await auth.getUser(verifiedToken.uid);
    if (
      process.env.ADMIN_EMAIL === userRecord.email &&
      !userRecord.customClaims?.admin
    ) {
      auth.setCustomUserClaims(verifiedToken.uid, {
        admin: true,
      });
    }
    const cookieStore = await cookies();
    cookieStore.set("firebaseAuthToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    cookieStore.set("firebaseAuthRefreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
  } catch (error) {
    console.error("Error in setToken:", error);
    throw new Error("Failed to verify token");
  }
};
