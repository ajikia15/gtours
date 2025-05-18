import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Navbar from "../../components/layout/Navbar";
import "@/styles/globals.css";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/auth";
import { Toaster } from "@/components/ui/sonner";
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} className="px-20">
      <body>
        <AuthProvider>
          <NextIntlClientProvider>
            <Navbar />
            {children}
            <Toaster />
            <Footer />
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
