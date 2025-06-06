"use server";
import ImageSectionSkeleton from "./image-section-skeleton";
import { getTourById } from "@/data/tours";
import { Suspense } from "react";
import ImageSection from "./image-section";
import TextSectionSkeleton from "./text-section-skeleton";
import TextSection from "./text-section";

import TourDetailsCard from "./tour-details-card";
import TourDetailsCardSkeleton from "./tour-details-card-skeleton";
import { getLocalizedTitle, getLocalizedDescription } from "@/lib/localizationHelpers";
import { getLocale } from "next-intl/server";
import TourMapSection from "@/components/map/tour-map-section";
import TourSuggestions from "./tour-suggestions";
import { isMobile } from "@/lib/isMobile";
import { headers } from "next/headers";
import { MobileImageSection } from "./mobile-image-section";
export default async function TourPage({
  params,
}: {
  params: Promise<{ tourId: string }>;
}) {
  const locale = await getLocale();
  const { tourId } = await params;
  const tour = await getTourById(tourId);

  const userAgent = (await headers()).get("user-agent") || "";
  const mobile = isMobile(userAgent);

  // console.log(tour);
  return (
    <div>
      {!mobile && (        <Suspense fallback={<ImageSectionSkeleton />}>
          <ImageSection
            images={tour.images}
            tourId={tourId}
            tourTitle={tour.title[0]}
          />
        </Suspense>
      )}
      {mobile && (
        <div className="flex flex-col gap-4 my-2  md:my-10">
          <Suspense fallback={<ImageSectionSkeleton />}>
            <MobileImageSection images={tour.images} tourTitle={tour.title[0]} />
          </Suspense>
        </div>
      )}

      <div className="flex flex-row md:gap-10 items-start px-6 md:px-0">
        <div className="flex flex-col gap-4 md:gap-8 h-full w-full">
          <div className="md:hidden">
            <h1 className="text-3xl text-center mb-1 font-bold text-gray-900">
              {getLocalizedTitle(tour, locale)}
            </h1>
            <h3 className="text-xl text-center text-gray-700 mb-1">
              Explore wonders of {getLocalizedTitle(tour, locale)}
            </h3>
            <div className="w-full mt-8 mb-2 h-px bg-gray-300"></div>
          </div>
          <Suspense fallback={<TextSectionSkeleton />}>
            <TextSection
              mobile={mobile}
              description={getLocalizedDescription(tour, locale)}
            />
          </Suspense>
          <div className="w-full h-80 my-10 md:my-0">
            <TourMapSection
              tourCoordinates={tour.coordinates}
              activities={tour.offeredActivities}
              tourTitle={tour.title[0]}
            />
          </div>
          <TourSuggestions />
        </div>
        <div className="sticky top-22 flex-1">
          {!mobile && (
            <Suspense fallback={<TourDetailsCardSkeleton />}>
              <TourDetailsCard tour={tour} />
            </Suspense>
          )}

          {/* <TourActivitiesSection activities={tour.offeredActivities} /> */}
        </div>
      </div>
    </div>
  );
}
