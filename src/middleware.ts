import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decodeJwt } from "jose";

// Define your locales and default locale
const locales = ["en", "ge", "ru"];
const defaultLocale = "en";

// Create the next-intl middleware
const handleI18nRouting = createMiddleware({
  locales,
  defaultLocale,
});

// Helper function to clear auth tokens
const clearAuthTokens = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("firebaseAuthToken");
  cookieStore.delete("firebaseAuthRefreshToken");
  console.log("Cleared invalid tokens from middleware");
};

// Helper function to create redirect URL
const createRedirectUrl = (
  locale: string,
  path: string,
  request: NextRequest
) => {
  return NextResponse.redirect(new URL(`/${locale}${path}`, request.url));
};

// Helper function to check admin access
const checkAdminAccess = async (
  token: string | undefined,
  locale: string,
  request: NextRequest
) => {
  if (!token) {
    return createRedirectUrl(locale, "/", request);
  }

  try {
    const decodedToken = decodeJwt(token);

    if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
      // Token expired - try to refresh
      return NextResponse.redirect(
        new URL(
          `/api/refresh-token?redirect=${encodeURIComponent(
            request.nextUrl.pathname
          )}`,
          request.url
        )
      );
    }

    if (!decodedToken.admin) {
      return createRedirectUrl(locale, "/", request);
    }
    return null; // No redirect needed
  } catch (error) {
    console.error("Token validation error in middleware:", error);
    // Clear invalid tokens
    await clearAuthTokens();
    return createRedirectUrl(locale, "/", request);
  }
};

// Helper function to check user authentication (for regular user routes)
const checkUserAuth = async (
  token: string | undefined,
  locale: string,
  request: NextRequest
) => {
  if (!token) {
    return createRedirectUrl(locale, "/login", request);
  }

  try {
    const decodedToken = decodeJwt(token);

    if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
      // Token expired - try to refresh
      return NextResponse.redirect(
        new URL(
          `/api/refresh-token?redirect=${encodeURIComponent(
            request.nextUrl.pathname
          )}`,
          request.url
        )
      );
    }

    return null; // No redirect needed - user is authenticated
  } catch (error) {
    console.error("Token validation error in middleware:", error);
    // Clear invalid tokens
    await clearAuthTokens();
    return createRedirectUrl(locale, "/login", request);
  }
};

// Helper function to handle admin routes
const handleAdminRoute = async (locale: string, request: NextRequest) => {
  if (request.method === "POST") {
    return null; // Allow POST requests
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("firebaseAuthToken")?.value;
  return checkAdminAccess(token, locale, request);
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/") {
    return createRedirectUrl(defaultLocale, "", request);
  }

  const [, locale, ...segments] = pathname.split("/");
  console.log(segments);

  if (pathname.match(/^\/(en|ge|ru)\/admin/)) {
    const adminRedirect = await handleAdminRoute(locale, request);
    if (adminRedirect) return adminRedirect;
  }

  const token = (await cookies()).get("firebaseAuthToken")?.value;

  // Protect account routes - only authenticated users can access
  if (pathname.startsWith(`/${locale}/account`)) {
    const userAuthRedirect = await checkUserAuth(token, locale, request);
    if (userAuthRedirect) return userAuthRedirect;
  }

  // Redirect authenticated users away from auth pages (login/register)
  // This handles redirects at the server level, avoiding client-side useEffect redirects
  if (
    token &&
    (pathname.startsWith(`/${locale}/login`) ||
      pathname.startsWith(`/${locale}/register`) ||
      pathname.startsWith(`/${locale}/forgot-password`))
  ) {
    return createRedirectUrl(locale, "/", request);
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: [
    "/",
    "/(en|ge|ru)/:path*",
    // Exclude static files and API routes from middleware
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)",
  ],
};
