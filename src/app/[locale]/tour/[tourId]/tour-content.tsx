import { getTourById } from "@/data/tours";
import ImageSection from "./image-section";
import TextSection from "./text-section";
import TourDetailsCard from "./tour-details-card";
import TourMapSection from "@/components/map/tour-map-section";
import TourSuggestions from "./tour-suggestions";
import { MobileImageSection } from "./mobile-image-section";
import MobileTourBooker from "./mobile-tour-booker";
import { Suspense } from "react";
import ImageSectionSkeleton from "./image-section-skeleton";
import TextSectionSkeleton from "./text-section-skeleton";
import TourDetailsCardSkeleton from "./tour-details-card-skeleton";
import TourSchedulesDisplay from "@/components/tour-schedules-display";
import {
  getLocalizedTitle,
  getLocalizedDescription,
} from "@/lib/localizationHelpers";

interface TourContentProps {
  tourId: string;
  locale: string;
  mobile: boolean;
}

export default async function TourContent({
  tourId,
  locale,
  mobile,
}: TourContentProps) {
  const tour = await getTourById(tourId);

  return (
    <>
      {!mobile && (
        <Suspense fallback={<ImageSectionSkeleton />}>
          <ImageSection
            images={tour.images}
            tourId={tourId}
            tourTitle={tour.title[0]}
          />
        </Suspense>
      )}
      {mobile && (
        <div className="flex flex-col gap-4 my-2 md:my-10">
          <Suspense fallback={<ImageSectionSkeleton />}>
            <MobileImageSection
              images={tour.images}
              tourTitle={tour.title[0]}
            />
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
          </div>{" "}
          <Suspense fallback={<TextSectionSkeleton />}>
            <TextSection
              mobile={mobile}
              description={getLocalizedDescription(tour, locale)}
            />
          </Suspense>
          {/* Tour Schedules Section */}
          {tour.schedules && tour.schedules.length > 0 && (
            <div className="my-8">
              <TourSchedulesDisplay
                schedules={tour.schedules}
                locale={locale}
              />
            </div>
          )}
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
        </div>
      </div>
      {mobile && <MobileTourBooker tour={tour} />}
    </>
  );
}
