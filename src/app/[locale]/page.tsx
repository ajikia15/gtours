import Carousel from "@/components/carousel/Carousel";
import QuickCategory from "@/components/carousel/QuickCategory";
import { getTranslations } from "next-intl/server";
import DisplayCardsSection from "./display-cards-section";
import { Suspense } from "react";
import { getTours } from "@/data/tours";
import InteractiveMapSection from "./interactive-map-section";
import TourCardSkeleton from "@/components/tour-card-skeleton";
import TourSearchBar from "@/components/tour-search-bar";
import MobileTourSearchBar from "@/components/mobile-tour-search-bar";
import ContactSection from "@/components/contact-section";

export default async function HomePage() {
  const t = await getTranslations("Homepage");

  return (
    <div className="mb-6 md:mb-12">
      {/* Mobile Search Bar - Above Carousel */}
      <div className="md:hidden px-4 mb-4">
        <Suspense
          fallback={
            <div className="bg-white shadow-lg rounded-lg p-4 h-16 animate-pulse"></div>
          }
        >
          <MobileSearchBarWithData />
        </Suspense>
      </div>

      <div className="relative">
        <Carousel />
        {/* Desktop Search Bar - Overlaid on Carousel */}
        <div className="hidden md:flex absolute left-0 right-0 bottom-0 justify-center pointer-events-none">
          <div
            className="pointer-events-auto w-full max-w-4xl px-4"
            style={{
              transform: "translateY(50%)",
            }}
          >
            <Suspense
              fallback={
                <div className="bg-white shadow-lg rounded-lg p-4 h-16 animate-pulse"></div>
              }
            >
              <DesktopSearchBarWithData />
            </Suspense>
          </div>
        </div>
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

async function MobileSearchBarWithData() {
  const { data: tours } = await getTours({
    pagination: { page: 1, pageSize: 20 },
  });

  return <MobileTourSearchBar tours={tours} className="shadow-lg" />;
}

async function DesktopSearchBarWithData() {
  const { data: tours } = await getTours({
    pagination: { page: 1, pageSize: 20 },
  });

  return <TourSearchBar tours={tours} className="shadow-lg" />;
}

async function MapWithData() {
  const { data: tours } = await getTours({
    pagination: { page: 1, pageSize: 20 },
  });

  return <InteractiveMapSection tours={tours} />;
}
