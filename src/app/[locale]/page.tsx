import Carousel from "@/components/carousel/Carousel";
import QuickCategory from "@/components/carousel/QuickCategory";
import InteractiveMapSection from "./interactive-map-section";
import { getTranslations } from "next-intl/server";
import DisplayCardsSection from "./display-cards-section";
import { Suspense } from "react";
import MapTourCardSkeleton from "@/components/ui/MapTourCardSkeleton";

export default async function HomePage() {
  // const t = useTranslations("Homepage");
  const t = await getTranslations("Homepage");

  // const { data } = await getTours();

  return (
    <div className="space-y-10 mb-10">
      <Carousel />
      <h1 className="text-center my-8 text-2xl font-bold">{t("activities")}</h1>
      <QuickCategory />
      <h1 className="text-center my-8 text-2xl font-bold">
        {t("discover-georgia")}
      </h1>
      <Suspense
        fallback={
          <div className="grid grid-cols-4 gap-4 p-4">
            {Array.from({ length: 4 }, (_, index) => (
              <MapTourCardSkeleton key={`skeleton-${index}`} />
            ))}
          </div>
        }
      >
        <DisplayCardsSection />
      </Suspense>
      {/* <InteractiveMapSection /> */}
    </div>
  );
}
