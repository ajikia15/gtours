import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Grid3X3, List } from "lucide-react";

export default function GallerySkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-4 w-80" />
        </div>

        {/* View Mode Toggle Skeleton */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
          <Button size="sm" variant="default" className="h-8 px-3" disabled>
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" className="h-8 px-3" disabled>
            <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
              <div className="bg-current rounded-sm"></div>
              <div className="bg-current rounded-sm"></div>
              <div className="bg-current rounded-sm h-2"></div>
              <div className="bg-current rounded-sm"></div>
            </div>
          </Button>
          <Button size="sm" variant="ghost" className="h-8 px-3" disabled>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Gallery Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-xl bg-gray-100 aspect-square"
          >
            <Skeleton className="w-full h-full" />

            {/* Skeleton overlay elements */}
            <div className="absolute top-3 left-3">
              <Skeleton className="h-6 w-8 rounded-full" />
            </div>

            <div className="absolute bottom-3 right-3">
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
