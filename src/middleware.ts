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

export async function middleware(request: NextRequest) {
  // Handle root path redirect
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  const [, locale, ...segments] = request.nextUrl.pathname.split("/");

  // Handle admin routes
  if (request.nextUrl.pathname.match(/(en|ge|ru)\/admin/)) {
    if (request.method === "POST") {
      return handleI18nRouting(request);
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("firebaseAuthToken")?.value;

    if (!token) {
      return NextResponse.redirect(new URL(`/${locale}/`, request.url));
    }

    try {
      const decodedToken = decodeJwt(token);
      if (!decodedToken.admin) {
        return NextResponse.redirect(new URL(`/${locale}/`, request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL(`/${locale}/`, request.url));
    }
  }

  // Handle i18n routing for all other requests
  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/", "/(en|ge|ru)/:path*"],
};
