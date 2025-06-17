import { getTours } from "@/data/tours";
import ShortTourCard from "@/components/short-tour-card";
import { getLocalizedTitle } from "@/lib/localizationHelpers";

interface SearchParams {
  destinations?: string;
  activities?: string;
  date?: string;
  adults?: string;
  children?: string;
  infants?: string;
}

interface DestinationsContentProps {
  locale: string;
  searchParams: SearchParams;
}

export default async function DestinationsContent({
  locale,
  searchParams,
}: DestinationsContentProps) {
  const { data: allTours } = await getTours({
    pagination: { page: 1, pageSize: 100 }, // Get more tours for filtering
  });

  const destinationFilters = searchParams.destinations?.split(",") || [];
  const activityFilters = searchParams.activities?.split(",") || [];
  const dateFilter = searchParams.date ? new Date(searchParams.date) : null;

  // Filter tours based on search parameters
  let filteredTours = allTours;

  if (destinationFilters.length > 0) {
    filteredTours = filteredTours.filter((tour) => {
      const localizedTitle = getLocalizedTitle(tour, locale);
      return destinationFilters.some((destination) =>
        localizedTitle.toLowerCase().includes(destination.toLowerCase())
      );
    });
  }

  if (activityFilters.length > 0) {
    filteredTours = filteredTours.filter((tour) =>
      activityFilters.some((activityId) =>
        tour.offeredActivities?.some(
          (offered) => offered.activityTypeId === activityId
        )
      )
    );
  }

  const hasFilters =
    destinationFilters.length > 0 || activityFilters.length > 0 || dateFilter;
  const toursToShow = hasFilters ? filteredTours : allTours.slice(0, 20);

  return (
    <>
      {hasFilters && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">
            {filteredTours.length} tour{filteredTours.length !== 1 ? "s" : ""}
            found
          </h3>
        </div>
      )}

      <section className="grid grid-cols-4 gap-4 mt-4">
        {toursToShow.map((tour) => (
          <div key={tour.id}>
            <ShortTourCard tour={tour} />
          </div>
        ))}
      </section>
    </>
  );
}
