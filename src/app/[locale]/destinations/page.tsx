import { getTranslations } from "next-intl/server";
import Header from "../header";
import { getTours } from "@/data/tours";
import { Suspense } from "react";
import TourCardSkeleton from "@/components/tour-card-skeleton";
import ShortTourCard from "@/components/short-tour-card";
import TourSearchBar from "@/components/tour-search-bar";
import { getLocalizedTitle } from "@/lib/localizationHelpers";

interface SearchParams {
  destinations?: string;
  activities?: string;
  date?: string;
  adults?: string;
  children?: string;
  infants?: string;
}

interface DestinationsPageProps {
  params: { locale: string };
  searchParams: Promise<SearchParams>;
}

export default async function DestinationsPage({
  params,
  searchParams,
}: DestinationsPageProps) {
  const t = await getTranslations("Pages.destinations");
  const { data: allTours } = await getTours({
    pagination: { page: 1, pageSize: 100 }, // Get more tours for filtering
  });

  // Parse search parameters
  const resolvedSearchParams = await searchParams;

  const destinationFilters =
    resolvedSearchParams.destinations?.split(",") || [];
  const activityFilters = resolvedSearchParams.activities?.split(",") || [];
  const dateFilter = resolvedSearchParams.date
    ? new Date(resolvedSearchParams.date)
    : null;

  // Filter tours based on search parameters
  let filteredTours = allTours;

  if (destinationFilters.length > 0) {
    filteredTours = filteredTours.filter((tour) => {
      const localizedTitle = getLocalizedTitle(tour, params.locale);
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
      <Header title={t("title")} />
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

      <section className="grid grid-cols-4 gap-4 mt-4">
        <Suspense
          fallback={Array.from({ length: 4 }, (_, index) => (
            <TourCardSkeleton key={`skeleton-${index}`} />
          ))}
        >
          {toursToShow.map((tour) => (
            <div key={tour.id}>
              <ShortTourCard tour={tour} />
            </div>
          ))}
        </Suspense>
      </section>
    </>
  );
}
