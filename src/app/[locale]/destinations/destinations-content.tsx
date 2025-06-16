import { getTours } from "@/data/tours";
import ShortTourCard from "@/components/short-tour-card";
import TourSearchBar from "@/components/tour-search-bar";
import { getLocalizedTitle } from "@/lib/localizationHelpers";

interface DestinationsContentProps {
  locale: string;
  searchParams: {
    destinations?: string;
    activities?: string;
    date?: string;
    adults?: string;
    children?: string;
    infants?: string;
    page?: string;
  };
}

// This component handles the actual data fetching
export default async function DestinationsContent({
  locale,
  searchParams,
}: DestinationsContentProps) {
  const currentPage = parseInt(searchParams.page || "1");
  const pageSize = 20;

  // Server-side data fetching
  const { data: allTours } = await getTours({
    pagination: {
      page: currentPage,
      pageSize:
        searchParams.destinations || searchParams.activities ? 100 : pageSize,
    },
  });

  // Apply filters
  const destinationFilters = searchParams.destinations?.split(",") || [];
  const activityFilters = searchParams.activities?.split(",") || [];
  const dateFilter = searchParams.date ? new Date(searchParams.date) : null;

  let filteredTours = allTours;
  const hasFilters =
    destinationFilters.length > 0 || activityFilters.length > 0 || dateFilter;

  if (hasFilters) {
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
  }

  const toursToShow = filteredTours;

  return (
    <>
      <h2 className="text-2xl font-bold my-8 text-center">მოძებნე</h2>

      <TourSearchBar tours={allTours} className="my-8 max-w-4xl" />

      {hasFilters && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">
            {filteredTours.length} tour{filteredTours.length !== 1 ? "s" : ""}{" "}
            found
          </h3>
        </div>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
        {toursToShow.map((tour, index) => (
          <div
            key={tour.id}
            className="opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards]"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <ShortTourCard tour={tour} />
          </div>
        ))}
      </section>
    </>
  );
}
