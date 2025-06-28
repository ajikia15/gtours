"use server";

import { cookies } from "next/headers";
import { auth } from "../firebase/server";

// Centralized cookie configuration to match auth-utils.ts
const COOKIE_CONFIG = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export const removeToken = async () => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("firebaseAuthToken");
    cookieStore.delete("firebaseAuthRefreshToken");
    console.log("Tokens removed successfully");
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
    const verifiedToken = await auth.verifyIdToken(token);
    if (!verifiedToken) {
      throw new Error("Invalid token");
    }

    const userRecord = await auth.getUser(verifiedToken.uid);

    // Parse comma-separated admin emails
    const adminEmails =
      process.env.ADMIN_EMAIL?.split(",").map((email) => email.trim()) || [];
    const isAdmin = adminEmails.includes(userRecord.email || "");

    if (isAdmin && !userRecord.customClaims?.admin) {
      await auth.setCustomUserClaims(verifiedToken.uid, {
        admin: true,
      });
    }

    const cookieStore = await cookies();

    // Set access token with 1 hour expiration
    const accessTokenExpiry = new Date();
    accessTokenExpiry.setHours(accessTokenExpiry.getHours() + 1);

    cookieStore.set("firebaseAuthToken", token, {
      ...COOKIE_CONFIG,
      expires: accessTokenExpiry,
    });

    // Set refresh token with 30 day expiration
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 30);

    cookieStore.set("firebaseAuthRefreshToken", refreshToken, {
      ...COOKIE_CONFIG,
      expires: refreshTokenExpiry,
    });

    console.log("Tokens set successfully with proper expiration");
  } catch (error) {
    console.error("Error in setToken:", error);
    throw new Error("Failed to verify token");
  }
};
