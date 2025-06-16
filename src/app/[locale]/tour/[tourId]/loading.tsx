import { Skeleton } from "@/components/ui/skeleton";
import TextSectionSkeleton from "./text-section-skeleton";
import TourDetailsCardSkeleton from "./tour-details-card-skeleton";

export default function TourLoading() {
  return (
    <div className="relative">
      {/* Image Section Skeleton */}
      <div className="grid grid-cols-4 gap-4 w-full my-10">
        {/* Column 1: Text placeholders and one image */}
        <div className="flex flex-col gap-4 aspect-[1/2]">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-3/4" />
            <div className="flex flex-row gap-2 text-lg">
              <Skeleton className="w-4 h-6" />
              <div className="w-full space-y-1">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-6 w-3/5" />
                <Skeleton className="h-6 w-1/3" />
              </div>
            </div>
          </div>
          <Skeleton className="w-full flex-1 rounded-xl" />
        </div>

        {/* Column 2-4: Image placeholders */}
        <div className="flex flex-col gap-4 aspect-[1/2]">
          <Skeleton className="w-full flex-1 rounded-xl" />
          <Skeleton className="w-full flex-1 rounded-xl" />
        </div>
        <div className="flex flex-col gap-4 aspect-[1/2]">
          <Skeleton className="w-full flex-1 rounded-xl" />
          <Skeleton className="w-full flex-1 rounded-xl" />
        </div>
        <div className="flex flex-col gap-4 aspect-[1/2]">
          <Skeleton className="w-full flex-1 rounded-xl" />
          <Skeleton className="w-full flex-1 rounded-xl" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1">
            <TextSectionSkeleton /> {/* Map section skeleton */}
            <div className="mt-8">
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-64 rounded-lg" />
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
          <Skeleton className="h-8 w-64 mb-6" />
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
    <div className="space-y-3">
      <Skeleton className="aspect-square rounded-lg" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}
