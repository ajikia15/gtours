import { Skeleton } from "@/components/ui/skeleton";
import CardSkeleton from "@/components/ui/card-skeleton";

export default function TourLoading() {
  return (
    <div className="relative">
      {/* Hero image section skeleton */}
      <div className="grid grid-cols-4 gap-4 w-full my-10 px-6 md:px-0">
        {/* Column 1: Text placeholders and one image */}
        <div className="flex flex-col gap-4 aspect-[1/2]">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-3/4" />
            <div className="flex flex-row gap-2">
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

        {/* Columns 2-4: Image placeholders */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-4 aspect-[1/2]">
            <Skeleton className="w-full flex-1 rounded-xl" />
            <Skeleton className="w-full flex-1 rounded-xl" />
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 space-y-8">
            {/* About section */}
            <div>
              <Skeleton className="h-8 w-1/3 mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </div>

            {/* Map section */}
            <div>
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-96">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
                <Skeleton className="h-6 w-1/2 mx-auto" />
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="size-5 rounded-full" />
                      <Skeleton className="h-5 flex-1" />
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Skeleton className="h-5 w-1/4 mb-2" />
                  <Skeleton className="h-12 w-full" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-1/2" />
                </div>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Tour suggestions skeleton */}
        <div className="mt-12">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }, (_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
