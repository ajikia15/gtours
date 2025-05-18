import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decodeJwt } from "jose";
import createMiddleware from "next-intl/middleware";

// Define your locales and default locale
const locales = ["en", "ge", "ru"];
const defaultLocale = "en";

// Create the next-intl middleware
const handleI18nRouting = createMiddleware({
  locales,
  defaultLocale,
});

export async function middleware(request: NextRequest) {
  const [, locale, ...segments] = request.nextUrl.pathname.split("/");
  // First check if this is an admin route that needs authentication
  if (request.nextUrl.pathname.match(/(en|ge|ru)\/admin/)) {
    if (request.method === "POST") {
      return NextResponse.next();
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("firebaseAuthToken")?.value;

    if (!token) {
      return NextResponse.redirect(new URL(`/${locale}/`, request.url));
    }

    const decodedToken = decodeJwt(token);
    if (!decodedToken) {
      return NextResponse.redirect(new URL(`/${locale}/`, request.url));
    }
    //   const { role } = decodedToken;
    //   if (role !== "admin") {
    //     return NextResponse.redirect(new URL("/", request.url));
    //   }
  }

  // Then handle i18n routing for all requests
  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/(en|ge|ru)/admin"],
};
