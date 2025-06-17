import CardSkeleton from "@/components/ui/card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function DestinationsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header skeleton */}
      <div className="space-y-4 mb-8">
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-6 w-32 mx-auto" />
      </div>

      {/* Search bar skeleton */}
      <div className="mb-8 max-w-4xl mx-auto">
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>

      {/* Results count skeleton */}
      <div className="mb-6">
        <Skeleton className="h-6 w-32" />
      </div>

      {/* Tours grid skeleton */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 12 }, (_, index) => (
          <CardSkeleton key={`loading-skeleton-${index}`} />
        ))}
      </section>
    </div>
  );
}
