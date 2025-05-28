import { auth } from "@/firebase/server";
import { cookies } from "next/headers";
import { DecodedIdToken } from "firebase-admin/auth";

// Simple cache to prevent race conditions in token refresh
const refreshPromises = new Map<string, Promise<string | null>>();

// Centralized cookie configuration
const COOKIE_CONFIG = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

/**
 * Attempts to refresh the Firebase token using the refresh token
 */
const refreshFirebaseToken = async (): Promise<string | null> => {
  const cacheKey = "token-refresh";

  // Return existing promise if refresh is already in progress
  if (refreshPromises.has(cacheKey)) {
    return refreshPromises.get(cacheKey)!;
  }

  const refreshPromise = (async (): Promise<string | null> => {
    try {
      const cookieStore = await cookies();
      const refreshToken = cookieStore.get("firebaseAuthRefreshToken")?.value;

      if (!refreshToken) {
        console.log("No refresh token available");
        return null;
      }

      const response = await fetch(
        `https://securetoken.googleapis.com/v1/token?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
          }),
        }
      );

      if (!response.ok) {
        console.error(
          "Failed to refresh token:",
          response.status,
          response.statusText
        );
        return null;
      }

      const data = await response.json();
      const newToken = data.id_token;
      const newRefreshToken = data.refresh_token;

      if (newToken) {
        // Set access token with 1 hour expiration
        const accessTokenExpiry = new Date();
        accessTokenExpiry.setHours(accessTokenExpiry.getHours() + 1);

        cookieStore.set("firebaseAuthToken", newToken, {
          ...COOKIE_CONFIG,
          expires: accessTokenExpiry,
        });

        if (newRefreshToken) {
          // Set refresh token with 30 day expiration
          const refreshTokenExpiry = new Date();
          refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 30);

          cookieStore.set("firebaseAuthRefreshToken", newRefreshToken, {
            ...COOKIE_CONFIG,
            expires: refreshTokenExpiry,
          });
        }

        console.log("Successfully refreshed Firebase token");
        return newToken;
      }

      return null;
    } catch (error) {
      console.error("Error refreshing Firebase token:", error);
      return null;
    } finally {
      // Always clean up the promise cache
      refreshPromises.delete(cacheKey);
    }
  })();

  // Cache the promise to prevent race conditions
  refreshPromises.set(cacheKey, refreshPromise);
  return refreshPromise;
};

/**
 * Clears authentication tokens from cookies
 */
const clearAuthTokens = async () => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("firebaseAuthToken");
    cookieStore.delete("firebaseAuthRefreshToken");
    console.log("Cleared authentication tokens");
  } catch (error) {
    console.error("Error clearing tokens:", error);
  }
};

/**
 * Centralized token verification utility with automatic refresh
 * Returns the verified token or throws an error
 */
export const verifyUserToken = async (
  token?: string
): Promise<DecodedIdToken> => {
  let tokenToVerify = token;

  if (!tokenToVerify) {
    const cookieStore = await cookies();
    tokenToVerify = cookieStore.get("firebaseAuthToken")?.value;
  }

  if (!tokenToVerify) {
    throw new Error("No authentication token found");
  }

  // Basic JWT format validation
  if (
    typeof tokenToVerify !== "string" ||
    tokenToVerify.split(".").length !== 3
  ) {
    throw new Error("Invalid token format");
  }

  try {
    const verifiedToken = await auth.verifyIdToken(tokenToVerify);
    if (!verifiedToken) {
      throw new Error("Token verification failed");
    }
    return verifiedToken;
  } catch (error) {
    console.error("Token verification error:", error);

    // If the provided token was passed as a parameter, don't attempt refresh
    if (token) {
      throw new Error("Invalid or expired token");
    }

    // Attempt to refresh the token if verification failed
    console.log("Attempting to refresh expired token...");
    const refreshedToken = await refreshFirebaseToken();

    if (refreshedToken) {
      try {
        const verifiedRefreshedToken = await auth.verifyIdToken(refreshedToken);
        if (verifiedRefreshedToken) {
          console.log("Successfully verified refreshed token");
          return verifiedRefreshedToken;
        }
      } catch (refreshError) {
        console.error("Failed to verify refreshed token:", refreshError);
      }
    }

    // If refresh failed or refreshed token is also invalid, clear tokens
    await clearAuthTokens();
    throw new Error("Invalid or expired token");
  }
};

/**
 * Verifies admin token specifically
 */
export const verifyAdminToken = async (
  token?: string
): Promise<DecodedIdToken> => {
  const verifiedToken = await verifyUserToken(token);

  if (!verifiedToken.admin) {
    throw new Error("Admin privileges required");
  }

  return verifiedToken;
};
