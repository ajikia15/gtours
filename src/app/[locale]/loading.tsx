import { Skeleton } from "@/components/ui/skeleton";
import SearchBarSkeleton from "@/components/search-bar-skeleton";
import MapSkeleton from "@/components/map-skeleton";

export default function HomeLoading() {
  return (
    <div className="space-y-10">
      {/* Hero carousel skeleton */}
      <div className="relative">
        <Skeleton className="h-96 w-full rounded-none" />

        {/* Search bar skeleton positioned over hero */}
        <div className="absolute left-0 right-0 bottom-0 flex justify-center pointer-events-none">
          <div
            className="pointer-events-auto w-full max-w-4xl px-4"
            style={{ transform: "translateY(50%)" }}
          >
            <SearchBarSkeleton variant="compact" className="shadow-lg" />
          </div>
        </div>
      </div>

      {/* Activities section */}
      <div className="space-y-8 px-4">
        <Skeleton className="h-8 w-48 mx-auto" />

        {/* Quick categories with staggered animation */}
        <div className="flex justify-center gap-4 overflow-x-auto">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 min-w-20"
            >
              <Skeleton
                className="size-16 rounded-full"
                style={{ animationDelay: `${index * 100}ms` }}
              />
              <Skeleton
                className="h-4 w-16"
                style={{ animationDelay: `${index * 100 + 50}ms` }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Discover Georgia section */}
      <div className="space-y-6 px-4">
        <Skeleton className="h-8 w-56 mx-auto" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton
                className="aspect-square w-full rounded-xl"
                style={{ animationDelay: `${index * 50}ms` }}
              />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-5 w-24" />
            </div>
          ))}
        </div>
      </div>

      {/* Interactive map section */}
      <div className="space-y-6 px-4">
        <Skeleton className="h-8 w-64 mx-auto" />
        <MapSkeleton className="rounded-lg" showControls={true} />
      </div>
    </div>
  );
}
