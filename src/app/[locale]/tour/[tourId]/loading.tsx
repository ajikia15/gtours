import ImageSectionSkeleton from "./image-section-skeleton";
import TextSectionSkeleton from "./text-section-skeleton";
import TourDetailsCardSkeleton from "./tour-details-card-skeleton";

export default function TourLoading() {
  return (
    <div className="relative">
      <ImageSectionSkeleton />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1">
            <TextSectionSkeleton />

            {/* Map section skeleton */}
            <div className="mt-8">
              <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
              <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-96">
            <div className="sticky top-24">
              <TourDetailsCardSkeleton />
            </div>
          </div>
        </div>

        {/* Tour suggestions skeleton */}
        <div className="mt-12">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }, (_, index) => (
              <TourSuggestionSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable skeleton component for tour suggestions
function TourSuggestionSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  );
}
