import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Navbar from "../../components/layout/Navbar";
import "@/styles/globals.css";
import Footer from "@/components/layout/Footer";
import BottomNavigation from "@/components/layout/BottomNavbar";
import { AuthProvider } from "@/context/auth";
import { CartProvider } from "@/context/cart";
import { BookingProvider } from "@/context/booking";
import { Toaster } from "@/components/ui/sonner";
import { roboto, notoSansGeorgian, openSans } from "./fonts";
import { getLocale, getMessages } from "next-intl/server";
import { headers } from "next/headers";
import { isMobile } from "@/lib/isMobile";
import MobileNavbar from "@/components/layout/MobileNavbar";
import NavigationProgress from "@/components/layout/navigation-progress";

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

  let fontClassName = "";
  switch (locale) {
    case "en":
      fontClassName = roboto.className;
      break;
    case "ge":
      fontClassName = notoSansGeorgian.className;
      break;
    case "ru":
      fontClassName = openSans.className;
      break;
    default:
      fontClassName = roboto.className;
  }

  const messages = await getMessages();

  const userAgent = (await headers()).get("user-agent") || "";
  const mobile = isMobile(userAgent);
  return (
    <html lang={locale}>
      <body className={`${fontClassName} antialiased `}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <NavigationProgress />
          <AuthProvider>
            <CartProvider>
              <BookingProvider>
                {!mobile && <Navbar />}
                {mobile && <MobileNavbar />}
                <div className="container mx-auto mt-20">
                  {children}
                  <Toaster />
                  <Footer />
                </div>
                {mobile && <BottomNavigation />}
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
