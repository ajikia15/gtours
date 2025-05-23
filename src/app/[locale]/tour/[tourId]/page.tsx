"use server";
import ImageSectionSkeleton from "./image-section-skeleton";
import { getTourById } from "@/data/tours";
import { Suspense } from "react";
import ImageSection from "./image-section";
import TextSectionSkeleton from "./text-section-skeleton";
import TextSection from "./text-section";

import TourDetailsCard from "./tour-details-card";
import TourDetailsCardSkeleton from "./tour-details-card-skeleton";
import { getLocalizedDescription } from "@/lib/localizationHelpers";
import { getLocale } from "next-intl/server";

export default async function TourPage({
  params,
}: {
  params: Promise<{ tourId: string }>;
}) {
  const locale = await getLocale();
  const { tourId } = await params;
  const tour = await getTourById(tourId);
  return (
    <div>
      <Suspense fallback={<ImageSectionSkeleton />}>
        <ImageSection
          images={tour.images}
          tourId={tourId}
          tourTitle={tour.title}
        />
      </Suspense>
      <div className="flex flex-row gap-10 items-start">
        <div className="flex flex-col gap-8 h-full w-full">
          <Suspense fallback={<TextSectionSkeleton />}>
            <TextSection description={getLocalizedDescription(tour, locale)} />
          </Suspense>
          <div className="w-full h-64 bg-teal-200 grid place-items-center rounded-xl">
            <h1>Map</h1>
          </div>
        </div>
        <div className="sticky top-22 flex-1">
          <Suspense fallback={<TourDetailsCardSkeleton />}>
            <TourDetailsCard tour={tour} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
