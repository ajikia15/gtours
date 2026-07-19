import QuickCategory from "@/components/carousel/QuickCategory";
import { getTranslations } from "next-intl/server";
import DisplayCardsSection from "./display-cards-section";
import { Suspense } from "react";
import { getTours } from "@/data/tours";
import InteractiveMapSection from "./interactive-map-section";
import TourCardSkeleton from "@/components/tour-card-skeleton";
import MobileHero from "@/components/mobile-hero";
import DesktopHero from "@/components/desktop-hero";
import ContactSection from "@/components/contact-section";

export default async function HomePage() {
  const t = await getTranslations("Homepage");

  return (
    <div className="mb-6 md:mb-12">
      {/* Mobile Hero - full-bleed rotating clips + search */}
      <div className="md:hidden">
        <Suspense fallback={<div className="-mt-20 h-[100dvh] bg-neutral-900" />}>
          <MobileHeroWithData />
        </Suspense>
      </div>

      {/* Desktop Hero - editorial copy + promotion rotation + search band */}
      <div className="hidden md:block">
        <Suspense
          fallback={<div className="h-[600px] bg-neutral-100 animate-pulse" />}
        >
          <DesktopHeroWithData />
        </Suspense>
      </div>

      <div className="space-y-6 md:space-y-16 mt-6 md:mt-16">
        <div>
          <h1 className="text-center mb-4 md:mb-6 text-xl md:text-2xl font-bold">
            {t("activities")}
          </h1>
          <QuickCategory />
        </div>

        <div>
          <h1 className="text-center mb-4 md:mb-6 text-xl md:text-2xl font-bold">
            {t("popular-tours")}
          </h1>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
                {Array.from({ length: 4 }, (_, index) => (
                  <TourCardSkeleton key={`skeleton-${index}`} />
                ))}
              </div>
            }
          >
            <DisplayCardsSection />
          </Suspense>
        </div>

        <div>
          <h1 className="text-center mb-4 md:mb-6 text-xl md:text-2xl font-bold">
            {t("discover-georgia")}
          </h1>
          <Suspense
            fallback={
              <div className="w-full h-96 bg-gray-200 animate-pulse rounded-lg"></div>
            }
          >
            <MapWithData />
          </Suspense>
        </div>

        {/* Contact Section */}
        <div>
          <h1 className="text-center mb-4 md:mb-6 text-xl md:text-2xl font-bold">
            {t("contact-us")}
          </h1>
          <Suspense
            fallback={
              <div className="w-full h-96 bg-gray-200 animate-pulse rounded-lg"></div>
            }
          >
            <ContactSection />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function MobileHeroWithData() {
  const { data: tours } = await getTours({
    pagination: { page: 1, pageSize: 20 },
  });

  return <MobileHero tours={tours} />;
}

async function DesktopHeroWithData() {
  const { data: tours } = await getTours({
    pagination: { page: 1, pageSize: 20 },
  });

  return <DesktopHero tours={tours} />;
}

async function MapWithData() {
  const { data: tours } = await getTours({
    pagination: { page: 1, pageSize: 20 },
  });

  return <InteractiveMapSection tours={tours} />;
}
