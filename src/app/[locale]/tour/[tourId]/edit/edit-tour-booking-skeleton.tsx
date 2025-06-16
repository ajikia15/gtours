import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function EditTourBookingSkeleton() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="text-center">
          <div className="h-8 bg-gray-200 animate-pulse rounded mx-auto w-56" />
          <div className="h-5 bg-gray-200 animate-pulse rounded mx-auto w-40 mt-2" />
        </CardHeader>
      </Card>

      {/* Current booking info */}
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 animate-pulse rounded w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 animate-pulse rounded w-16" />
              <div className="h-6 bg-gray-100 animate-pulse rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 animate-pulse rounded w-20" />
              <div className="h-6 bg-gray-100 animate-pulse rounded" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-20" />
            <div className="h-16 bg-gray-100 animate-pulse rounded" />
          </div>
        </CardContent>
      </Card>

      {/* Edit form */}
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 animate-pulse rounded w-32" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* New date picker skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-24" />
            <div className="h-10 bg-gray-200 animate-pulse rounded" />
          </div>

          {/* New travelers skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-28" />
            <div className="h-16 bg-gray-200 animate-pulse rounded" />
          </div>

          {/* New activities skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-28" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }, (_, index) => (
                <div
                  key={index}
                  className="h-24 bg-gray-200 animate-pulse rounded"
                />
              ))}
            </div>
          </div>

          {/* Price comparison skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-32" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-16 bg-gray-100 animate-pulse rounded" />
              <div className="h-16 bg-gray-200 animate-pulse rounded" />
            </div>
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
