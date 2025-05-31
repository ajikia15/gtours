import Carousel from "@/components/carousel/Carousel";
import QuickCategory from "@/components/carousel/QuickCategory";
import { getTranslations } from "next-intl/server";
import DisplayCardsSection from "./display-cards-section";
import { Suspense } from "react";
import BookingBar from "@/components/booking-bar";
import { getTours } from "@/data/tours";
import InteractiveMapSection from "./interactive-map-section";
import TourCardSkeleton from "@/components/tour-card-skeleton";

export default async function HomePage() {
  // const t = useTranslations("Homepage");
  const t = await getTranslations("Homepage");

  const { data: tours } = await getTours({
    pagination: { page: 1, pageSize: 20 }, // Get more tours for selection
  });

  return (
    <div className="space-y-10 mb-10">
      <Carousel />
      <h1 className="text-center my-8 text-2xl font-bold">{t("activities")}</h1>
      <QuickCategory />

      {/* BookingBar for testing */}
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Book Your Adventure
        </h2>
        <BookingBar tours={tours} mode="add" />
      </div>

      <h1 className="text-center my-8 text-2xl font-bold">
        {t("discover-georgia")}
      </h1>
      <Suspense
        fallback={
          <div className="grid grid-cols-4 gap-4 p-4">
            {Array.from({ length: 4 }, (_, index) => (
              <TourCardSkeleton key={`skeleton-${index}`} />
            ))}
          </div>
        }
      >
        <DisplayCardsSection />
      </Suspense>
      <InteractiveMapSection tours={tours} />
    </div>
  );
}
