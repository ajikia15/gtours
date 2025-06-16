import TourCardSkeleton from "@/components/tour-card-skeleton";
import SearchBarSkeleton from "@/components/search-bar-skeleton";

export default function HomePageSkeleton() {
  return (
    <div className="space-y-10 mb-10">
      {/* Carousel and search bar area */}
      <div className="relative">
        {/* Carousel skeleton */}
        <div className="h-96 md:h-[500px] bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg" />

        {/* Search bar skeleton positioned over carousel */}
        <div className="absolute left-0 right-0 bottom-0 flex justify-center pointer-events-none">
          <div
            className="pointer-events-auto w-full max-w-4xl px-4"
            style={{
              transform: "translateY(50%)",
            }}
          >
            <SearchBarSkeleton />
          </div>
        </div>
      </div>

      {/* Activities section */}
      <div className="space-y-8">
        <div className="h-8 bg-gray-200 animate-pulse rounded mx-auto w-48" />

        {/* Quick category skeleton */}
        <div className="flex justify-center gap-4 flex-wrap">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={`category-skeleton-${index}`}
              className="h-12 w-24 bg-gray-200 animate-pulse rounded-full"
            />
          ))}
        </div>
      </div>

      {/* Discover Georgia section */}
      <div className="space-y-8">
        <div className="h-8 bg-gray-200 animate-pulse rounded mx-auto w-56" />

        {/* Tour cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          {Array.from({ length: 4 }, (_, index) => (
            <TourCardSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      </div>

      {/* Interactive map skeleton */}
      <div className="h-96 bg-gray-200 animate-pulse rounded-lg mx-4" />
    </div>
  );
}
