import { getTourById } from "@/data/tours";
import ImageSection from "./image-section";
import { MobileImageSection } from "./mobile-image-section";
import TextSection from "./text-section";
import TourDetailsCard from "./tour-details-card";
import TourMapSection from "@/components/map/tour-map-section";
import TourSuggestions from "./tour-suggestions";
import MobileTourBooker from "./mobile-tour-booker";
import {
  getLocalizedTitle,
  getLocalizedDescription,
} from "@/lib/localizationHelpers";

interface TourContentProps {
  tourId: string;
  locale: string;
  mobile: boolean;
}

// This component handles the actual data fetching and rendering
export default async function TourContent({
  tourId,
  locale,
  mobile,
}: TourContentProps) {
  // This is where the actual data fetching happens
  const tour = await getTourById(tourId);

  return (
    <>
      {/* Image Section */}
      {!mobile ? (
        <ImageSection
          images={tour.images}
          tourId={tourId}
          tourTitle={tour.title[0]}
        />
      ) : (
        <div className="flex flex-col gap-4 my-2 md:my-10">
          <MobileImageSection images={tour.images} tourTitle={tour.title[0]} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-row md:gap-10 items-start px-6 md:px-0">
        <div className="flex flex-col gap-4 md:gap-8 h-full w-full">
          {/* Mobile Title */}
          {mobile && (
            <div>
              <h1 className="text-3xl text-center mb-1 font-bold text-gray-900">
                {getLocalizedTitle(tour, locale)}
              </h1>
              <h3 className="text-xl text-center text-gray-700 mb-1">
                Explore wonders of {getLocalizedTitle(tour, locale)}
              </h3>
              <div className="w-full mt-8 mb-2 h-px bg-gray-300"></div>
            </div>
          )}

          {/* Text Section */}
          <TextSection
            mobile={mobile}
            description={getLocalizedDescription(tour, locale)}
          />

          {/* Map Section */}
          <div className="w-full h-80 my-10 md:my-0">
            <TourMapSection
              tourCoordinates={tour.coordinates}
              activities={tour.offeredActivities}
              tourTitle={tour.title[0]}
            />
          </div>

          {/* Tour Suggestions */}
          <TourSuggestions />
        </div>

        {/* Sidebar - Desktop Only */}
        <div className="sticky top-22 flex-1">
          {!mobile && <TourDetailsCard tour={tour} />}
        </div>
      </div>

      {/* Mobile Booker */}
      {mobile && <MobileTourBooker tour={tour} />}
    </>
  );
}
