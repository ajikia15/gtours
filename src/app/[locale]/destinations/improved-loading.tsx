import TourCardSkeleton from "@/components/tour-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function ImprovedDestinationsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header skeleton with search bar */}
      <div className="space-y-6 mb-8">
        <div className="text-center space-y-4">
          <Skeleton className="h-10 w-64 mx-auto" />
          <Skeleton className="h-6 w-32 mx-auto" />
        </div>

        {/* Enhanced search bar skeleton - More detailed */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Destination filter */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>

              {/* Activity filter */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>

              {/* Date picker */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>

              {/* Travelers */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>

            {/* Search button */}
            <div className="flex justify-center">
              <Skeleton className="h-12 w-32 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Progressive loading - Show more skeletons initially */}
      <div className="space-y-6">
        {/* Filter tags skeleton */}
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-6 w-20 rounded-full" />
          ))}
        </div>

        {/* Results count skeleton */}
        <Skeleton className="h-6 w-48" />

        {/* Tours grid - Show 12 skeletons for better perceived performance */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }, (_, index) => (
            <TourCardSkeleton
              key={`loading-skeleton-${index}`}
              className={`${index > 7 ? "animate-pulse-delayed" : ""}`}
            />
          ))}
        </section>

        {/* Pagination skeleton */}
        <div className="flex justify-center items-center gap-2 mt-8">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <span className="text-gray-400">...</span>
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}
