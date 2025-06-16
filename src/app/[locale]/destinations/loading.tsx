import TourCardSkeleton from "@/components/tour-card-skeleton";

export default function DestinationsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header skeleton */}
      <div className="animate-pulse mb-8">
        <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-32 mx-auto"></div>
      </div>

      {/* Search bar skeleton */}
      <div className="animate-pulse mb-8 max-w-4xl mx-auto">
        <div className="h-12 bg-gray-200 rounded-lg"></div>
      </div>

      {/* Tours grid skeleton */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 12 }, (_, index) => (
          <TourCardSkeleton key={`loading-skeleton-${index}`} />
        ))}
      </section>
    </div>
  );
}
