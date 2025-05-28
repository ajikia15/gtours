import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Centralized cookie configuration
const COOKIE_CONFIG = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const redirect = searchParams.get("redirect");

  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("firebaseAuthRefreshToken")?.value;

  if (!refreshToken) {
    console.log("No refresh token found, redirecting to login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
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
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const json = await response.json();
    const newToken = json.id_token;
    const newRefreshToken = json.refresh_token;

    if (!newToken) {
      console.error("No token received from refresh response");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Update both access token and refresh token
    const accessTokenExpiry = new Date();
    accessTokenExpiry.setHours(accessTokenExpiry.getHours() + 1);

    cookieStore.set("firebaseAuthToken", newToken, {
      ...COOKIE_CONFIG,
      expires: accessTokenExpiry,
    });

    if (newRefreshToken) {
      const refreshTokenExpiry = new Date();
      refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 30);

      cookieStore.set("firebaseAuthRefreshToken", newRefreshToken, {
        ...COOKIE_CONFIG,
        expires: refreshTokenExpiry,
      });
    }

    console.log("Successfully refreshed tokens via API route");
    return NextResponse.redirect(new URL(redirect || "/", request.url));
  } catch (error) {
    console.error("Error refreshing token:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
};
