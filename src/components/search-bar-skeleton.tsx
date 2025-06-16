import { Skeleton } from "@/components/ui/skeleton";

interface SearchBarSkeletonProps {
  className?: string;
  variant?: "full" | "compact";
}

export default function SearchBarSkeleton({
  className = "",
  variant = "full",
}: SearchBarSkeletonProps) {
  if (variant === "compact") {
    return (
      <div className={`bg-white rounded-lg shadow-md p-3 ${className}`}>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-6 flex-1" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg p-4 space-y-4 ${className}`}>
      {/* Main search fields */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Destination field */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Activities field */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Date field */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Travelers field */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>

      {/* Search button */}
      <div className="flex justify-center">
        <Skeleton className="h-12 w-32 rounded-md" />
      </div>

      {/* Filter pills (sometimes shown) */}
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 2 }, (_, index) => (
          <Skeleton key={index} className="h-6 w-16 rounded-full" />
        ))}
      </div>
    </div>
  );
}
