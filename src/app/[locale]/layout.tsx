import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Navbar from "../../components/layout/Navbar";
import "@/styles/globals.css";
import Footer from "@/components/layout/Footer";
import BottomNavigation from "@/components/layout/BottomNavbar";
import BottomNavGate from "@/components/layout/BottomNavGate";
import { AuthProvider } from "@/context/auth";
import { CartProvider } from "@/context/cart";
import { BookingProvider } from "@/context/booking";
import { Toaster } from "@/components/ui/sonner";
import {
  cabinetGrotesk,
  plusJakartaSans,
  spaceMono,
  notoSansGeorgian,
  openSans,
} from "./fonts";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { isMobile } from "@/lib/isMobile";
import MobileNavbar from "@/components/layout/MobileNavbar";
import NavigationProgress from "@/components/layout/navigation-progress";
import { NavigationLoadingOverlay } from "@/components/navigation-loading-overlay";
import RemixWizard from "@/components/remix-wizard";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
    title: {
      default: t("title"),
      template: `%s | ${t("siteName")}`,
    },
    description: t("description"),
    openGraph: {
      type: "website",
      siteName: t("siteName"),
      title: t("title"),
      description: t("description"),
      locale,
      images: [
        {
          url: "/header.jpg",
          width: 1200,
          height: 630,
          alt: t("siteName"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/header.jpg"],
    },
  };
}

export default async function LocaleLayout({
  children,
}: // params,
{
  children: React.ReactNode;
  // params: { locale: string };
}) {
  const locale = await getLocale();

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const englishFonts = `${plusJakartaSans.variable} ${cabinetGrotesk.variable} ${spaceMono.variable} ${plusJakartaSans.className}`;
  let fontClassName = "";
  switch (locale) {
    case "en":
      fontClassName = englishFonts;
      break;
    case "ge":
      fontClassName = notoSansGeorgian.className;
      break;
    case "ru":
      fontClassName = openSans.className;
      break;
    default:
      fontClassName = englishFonts;
  }

  const messages = await getMessages();

  const userAgent = (await headers()).get("user-agent") || "";
  const mobile = isMobile(userAgent);
  return (
    <html lang={locale}>
      <body className={`${fontClassName} antialiased `}>
        {" "}
        <NextIntlClientProvider locale={locale} messages={messages}>
          <NavigationProgress />
          <NavigationLoadingOverlay />
          <AuthProvider>
            <CartProvider>
              <BookingProvider>
                {!mobile && <Navbar />}
                {mobile && <MobileNavbar />}
                <div className="container mx-auto mt-20 md:mt-28">
                  {children}
                  <Toaster />
                  <Footer />
                </div>
                {mobile && (
                  <BottomNavGate>
                    <BottomNavigation />
                  </BottomNavGate>
                )}
                <RemixWizard />
              </BookingProvider>
            </CartProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

// Generate static params for all locales to enable instant navigation
export async function generateStaticParams() {
  return routing.locales.map((locale) => ({
    locale: locale,
  }));
}
