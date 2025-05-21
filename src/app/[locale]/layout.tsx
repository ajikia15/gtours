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
    <html lang={locale} className="">
      <body className="">
        <NextIntlClientProvider>
          <AuthProvider>
            <div className="container mx-auto">
              <Navbar />
              {children}
              <Toaster />
              <Footer />
            </div>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
