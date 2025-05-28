"use client";

import { auth } from "@/firebase/client";

// Simple cache to prevent unnecessary token refreshes
let lastTokenRefresh = 0;
const TOKEN_REFRESH_COOLDOWN = 30000; // 30 seconds

/**
 * Gets a fresh Firebase token with basic caching to reduce server calls
 */
export const getFreshToken = async (): Promise<string | null> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.log("No authenticated user found");
      return null;
    }

    // Check cooldown to prevent excessive refreshes
    const now = Date.now();
    if (now - lastTokenRefresh < TOKEN_REFRESH_COOLDOWN) {
      try {
        // Return cached token if recent refresh
        return await user.getIdToken(false);
      } catch {
        // If cached token fails, proceed with refresh
      }
    }

    // Force refresh the token
    const token = await user.getIdToken(true);
    lastTokenRefresh = now;

    return token;
  } catch (error) {
    console.error("Error getting fresh token:", error);
    return null;
  }
};

/**
 * Checks if the current user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!auth.currentUser;
};

/**
 * Gets the current user's UID
 */
export const getCurrentUserUid = (): string | null => {
  return auth.currentUser?.uid || null;
};

/**
 * Gets current token without forcing refresh - useful for quick checks
 */
export const getCurrentToken = async (): Promise<string | null> => {
  try {
    const user = auth.currentUser;
    if (!user) return null;

    return await user.getIdToken(false);
  } catch (error) {
    console.error("Error getting current token:", error);
    return null;
  }
};

/**
 * Checks if current token needs refresh (within 5 minutes of expiry)
 */
export const shouldRefreshToken = async (): Promise<boolean> => {
  try {
    const user = auth.currentUser;
    if (!user) return true;

    const tokenResult = await user.getIdTokenResult(false);
    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);

    return (
      !tokenResult.expirationTime ||
      new Date(tokenResult.expirationTime) <= fiveMinutesFromNow
    );
  } catch {
    return true;
  }
};

/**
 * Utility for making authenticated API calls with automatic token handling
 */
export const makeAuthenticatedRequest = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = await getFreshToken();

  if (!token) {
    throw new Error("No valid authentication token available");
  }

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
};
