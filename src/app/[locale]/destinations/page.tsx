import { getTranslations } from "next-intl/server";
import Header from "../header";
import { Suspense } from "react";
import SearchBarSkeleton from "@/components/search-bar-skeleton";
import TourCardSkeleton from "@/components/tour-card-skeleton";
import DestinationsContent from "./destinations-content";

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
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}

export default async function DestinationsPage({
  params,
  searchParams,
}: DestinationsPageProps) {
  const t = await getTranslations("Pages.destinations");
  const resolvedSearchParams = await searchParams;
  const resolvedParams = await params;

  return (
    <>
      <Header title={t("title")} />

      {/* Single Suspense boundary for entire content */}
      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-8">
            {/* Header skeleton */}
            <div className="space-y-6 mb-8">
              <div className="text-center space-y-4">
                <div className="h-10 w-64 mx-auto bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-32 mx-auto bg-gray-200 rounded animate-pulse" />
              </div>

              {/* Search bar skeleton */}
              <SearchBarSkeleton className="max-w-4xl mx-auto" />
            </div>

            {/* Progressive loading indicators */}
            <div className="space-y-6">
              {/* Filter tags skeleton */}
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: 3 }, (_, index) => (
                  <div
                    key={index}
                    className="h-6 w-20 rounded-full bg-gray-200 animate-pulse"
                  />
                ))}
              </div>

              {/* Results count skeleton */}
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />

              {/* Tours grid skeleton */}
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 16 }, (_, index) => (
                  <TourCardSkeleton
                    key={`loading-skeleton-${index}`}
                    className={`
                      ${index > 7 ? "opacity-75" : ""} 
                      ${index > 11 ? "opacity-50" : ""}
                    `}
                  />
                ))}
              </section>
            </div>
          </div>
        }
      >
        <DestinationsContent
          locale={resolvedParams.locale}
          searchParams={resolvedSearchParams}
        />
      </Suspense>
    </>
  );
}
