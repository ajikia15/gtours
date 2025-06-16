import TourCardSkeleton from "@/components/tour-card-skeleton";
import SearchBarSkeleton from "@/components/search-bar-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function DestinationsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header skeleton */}
      <div className="space-y-6 mb-8">
        <div className="text-center space-y-4">
          <Skeleton className="h-10 w-64 mx-auto" />
          <Skeleton className="h-6 w-32 mx-auto" />
        </div>

        {/* Enhanced search bar skeleton */}
        <SearchBarSkeleton className="max-w-4xl mx-auto" />
      </div>

      {/* Progressive loading indicators */}
      <div className="space-y-6">
        {/* Filter tags skeleton */}
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-6 w-20 rounded-full" />
          ))}
        </div>

        {/* Results count skeleton */}
        <Skeleton className="h-6 w-48" />

        {/* Tours grid skeleton - Progressive loading */}
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

        {/* Pagination skeleton */}
        <div className="flex justify-center items-center gap-2 mt-8">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <span className="text-gray-400 mx-2">...</span>
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
    </div>
  );
}
