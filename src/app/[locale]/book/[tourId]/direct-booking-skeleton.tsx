import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DirectBookingSkeleton() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="text-center">
          <div className="h-8 bg-gray-200 animate-pulse rounded mx-auto w-48" />
          <div className="h-5 bg-gray-200 animate-pulse rounded mx-auto w-32 mt-2" />
        </CardHeader>
      </Card>

      {/* Pre-fill notification */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="h-5 w-5 bg-gray-200 animate-pulse rounded-full mt-0.5" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
              <div className="space-y-1">
                {Array.from({ length: 3 }, (_, index) => (
                  <div
                    key={index}
                    className="h-3 bg-gray-100 animate-pulse rounded w-full"
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main booking form */}
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 animate-pulse rounded w-40" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date picker skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-24" />
            <div className="h-10 bg-gray-200 animate-pulse rounded" />
          </div>

          {/* Travelers skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-20" />
            <div className="h-16 bg-gray-200 animate-pulse rounded" />
          </div>

          {/* Activities skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-20" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }, (_, index) => (
                <div
                  key={index}
                  className="h-24 bg-gray-200 animate-pulse rounded"
                />
              ))}
            </div>
          </div>

          {/* Price summary skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-24" />
            <div className="h-20 bg-gray-200 animate-pulse rounded" />
          </div>

          {/* Action buttons skeleton */}
          <div className="flex gap-4">
            <div className="h-10 bg-gray-200 animate-pulse rounded w-20" />
            <div className="h-10 bg-gray-200 animate-pulse rounded flex-1" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
