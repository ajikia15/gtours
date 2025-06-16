import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function EditTourSkeleton() {
  return (
    <div className="max-w-xl mx-auto mt-5">
      {/* Breadcrumbs skeleton */}
      <div className="flex items-center space-x-2 mb-5">
        <div className="h-4 bg-gray-200 animate-pulse rounded w-24" />
        <div className="h-4 bg-gray-200 animate-pulse rounded w-1" />
        <div className="h-4 bg-gray-200 animate-pulse rounded w-16" />
        <div className="h-4 bg-gray-200 animate-pulse rounded w-1" />
        <div className="h-4 bg-gray-200 animate-pulse rounded w-20" />
      </div>

      <Card className="mt-5">
        <CardHeader>
          <div className="h-7 bg-gray-200 animate-pulse rounded w-48" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Form fields skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-16" />
            <div className="h-10 bg-gray-200 animate-pulse rounded" />
          </div>

          <div className="space-y-2">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-20" />
            <div className="h-10 bg-gray-200 animate-pulse rounded" />
          </div>

          <div className="space-y-2">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-24" />
            <div className="h-24 bg-gray-200 animate-pulse rounded" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 animate-pulse rounded w-20" />
              <div className="h-10 bg-gray-200 animate-pulse rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 animate-pulse rounded w-18" />
              <div className="h-10 bg-gray-200 animate-pulse rounded" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 animate-pulse rounded w-24" />
              <div className="h-10 bg-gray-200 animate-pulse rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 animate-pulse rounded w-24" />
              <div className="h-10 bg-gray-200 animate-pulse rounded" />
            </div>
          </div>

          {/* Image upload skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-16" />
            <div className="h-32 bg-gray-200 animate-pulse rounded" />
          </div>

          {/* Activities skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-20" />
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 6 }, (_, index) => (
                <div
                  key={index}
                  className="h-10 bg-gray-200 animate-pulse rounded"
                />
              ))}
            </div>
          </div>

          {/* Status and coordinates skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-16" />
            <div className="h-10 bg-gray-200 animate-pulse rounded" />
          </div>

          <div className="space-y-2">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-24" />
            <div className="h-20 bg-gray-200 animate-pulse rounded" />
          </div>

          {/* Button skeleton */}
          <div className="flex justify-end">
            <div className="h-10 bg-gray-200 animate-pulse rounded w-24" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
