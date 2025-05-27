import { auth } from "@/firebase/server";
import { cookies } from "next/headers";
import { DecodedIdToken } from "firebase-admin/auth";

/**
 * Centralized token verification utility
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
    // Log the error for debugging but don't expose internal details
    console.error("Token verification error:", error);
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
