import { Skeleton } from "@/components/ui/skeleton";

export default function AccountLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-8 space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>

        {/* Navigation tabs skeleton */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton
              key={index}
              className="h-10 w-24 rounded-md flex-shrink-0"
            />
          ))}
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar skeleton */}
          <div className="lg:col-span-1 space-y-4">
            <div className="p-4 border rounded-lg space-y-3">
              <Skeleton className="size-20 rounded-full mx-auto" />
              <Skeleton className="h-6 w-32 mx-auto" />
              <Skeleton className="h-4 w-40 mx-auto" />
            </div>

            <div className="space-y-2">
              {Array.from({ length: 6 }, (_, index) => (
                <Skeleton key={index} className="h-10 w-full rounded-md" />
              ))}
            </div>
          </div>

          {/* Main content skeleton */}
          <div className="lg:col-span-3 space-y-6">
            <div className="border rounded-lg p-6 space-y-4">
              <Skeleton className="h-8 w-48" />

              {/* Form fields skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 6 }, (_, index) => (
                  <div key={index} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>

              <Skeleton className="h-10 w-32" />
            </div>

            {/* Additional content sections */}
            {Array.from({ length: 2 }, (_, index) => (
              <div key={index} className="border rounded-lg p-6 space-y-4">
                <Skeleton className="h-6 w-40" />
                <div className="space-y-3">
                  {Array.from({ length: 3 }, (_, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-3 border rounded"
                    >
                      <div className="space-y-1 flex-1">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                      <Skeleton className="h-8 w-20" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
