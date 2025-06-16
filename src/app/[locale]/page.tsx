import Carousel from "@/components/carousel/Carousel";
import QuickCategory from "@/components/carousel/QuickCategory";
import { getTranslations } from "next-intl/server";
import DisplayCardsSection from "./display-cards-section";
import { Suspense } from "react";
import { getTours } from "@/data/tours";
import InteractiveMapSection from "./interactive-map-section";
import TourCardSkeleton from "@/components/tour-card-skeleton";
import TourSearchBar from "@/components/tour-search-bar";

export default async function HomePage() {
  const t = await getTranslations("Homepage");

  return (
    <div className="space-y-10 mb-10">
      <div className="relative">
        <Carousel />
        <div className="absolute left-0 right-0 bottom-0 flex justify-center pointer-events-none">
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
              <SearchBarWithData />
            </Suspense>
          </div>
        </div>
      </div>
      <h1 className="text-center my-8 text-2xl font-bold">{t("activities")}</h1>
      <QuickCategory />

      <h1 className="text-center my-8 text-2xl font-bold">
        {t("discover-georgia")}
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

      <Suspense
        fallback={
          <div className="w-full h-96 bg-gray-200 animate-pulse rounded-lg"></div>
        }
      >
        <MapWithData />
      </Suspense>
    </div>
  );
}

async function SearchBarWithData() {
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
