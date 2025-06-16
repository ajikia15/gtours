import { getTranslations } from "next-intl/server";
import Header from "../header";
import { getTours } from "@/data/tours";
import { Suspense } from "react";
import ShortTourCard from "@/components/short-tour-card";
import TourSearchBar from "@/components/tour-search-bar";
import { getLocalizedTitle } from "@/lib/localizationHelpers";
import ProgressiveLoading from "@/components/progressive-loading";

interface SearchParams {
  destinations?: string;
  activities?: string;
  date?: string;
  adults?: string;
  children?: string;
  infants?: string;
  page?: string;
}

interface DestinationsPageProps {
  params: { locale: string };
  searchParams: Promise<SearchParams>;
}

export default async function OptimizedDestinationsPage({
  params,
  searchParams,
}: DestinationsPageProps) {
  const t = await getTranslations("Pages.destinations");

  // Parse search parameters
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || "1");
  const pageSize = 20; // Reduced from 100 for better performance

  // Get filtered data more efficiently
  const { data: allTours, totalPages } = await getTours({
    pagination: {
      page: currentPage,
      pageSize:
        resolvedSearchParams.destinations || resolvedSearchParams.activities
          ? 100 // Only load more if filters are applied
          : pageSize,
    },
  });

  const destinationFilters =
    resolvedSearchParams.destinations?.split(",") || [];
  const activityFilters = resolvedSearchParams.activities?.split(",") || [];
  const dateFilter = resolvedSearchParams.date
    ? new Date(resolvedSearchParams.date)
    : null;

  // Apply client-side filtering only when needed
  let filteredTours = allTours;
  const hasFilters =
    destinationFilters.length > 0 || activityFilters.length > 0 || dateFilter;

  if (hasFilters) {
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
  }

  const toursToShow = filteredTours;

  return (
    <>
      <Header title={t("title")} />
      <h2 className="text-2xl font-bold my-8 text-center">მოძებნე</h2>

      {/* Search bar with loading state */}
      <Suspense
        fallback={
          <div className="my-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-4 animate-pulse">
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        }
      >
        <TourSearchBar tours={allTours} className="my-8 max-w-4xl" />
      </Suspense>

      {hasFilters && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">
            {filteredTours.length} tour{filteredTours.length !== 1 ? "s" : ""}{" "}
            found
          </h3>
        </div>
      )}

      {/* Progressive loading for tours */}
      <section className="mt-4">
        <Suspense
          fallback={
            <ProgressiveLoading isLoading={true} itemCount={16}>
              <></>
            </ProgressiveLoading>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {toursToShow.map((tour, index) => (
              <div
                key={tour.id}
                className="progressive-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ShortTourCard tour={tour} />
              </div>
            ))}
          </div>
        </Suspense>
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
            const pageNum = index + 1;
            const isActive = pageNum === currentPage;
            return (
              <a
                key={pageNum}
                href={`?${new URLSearchParams({
                  ...resolvedSearchParams,
                  page: pageNum.toString(),
                }).toString()}`}
                className={`
                  px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "bg-brand-secondary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }
                `}
              >
                {pageNum}
              </a>
            );
          })}
        </div>
      )}
    </>
  );
}

// Export metadata for better SEO and loading
export async function generateMetadata({
  searchParams,
}: DestinationsPageProps) {
  const t = await getTranslations("Pages.destinations");
  const resolvedSearchParams = await searchParams;

  const hasFilters =
    resolvedSearchParams.destinations || resolvedSearchParams.activities;
  const title = hasFilters ? `${t("title")} - Filtered Results` : t("title");

  return {
    title,
    description: "Discover amazing tours and destinations in Georgia",
  };
}
