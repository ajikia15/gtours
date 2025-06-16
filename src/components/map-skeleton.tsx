import { Skeleton } from "@/components/ui/skeleton";

interface MapSkeletonProps {
  className?: string;
  height?: string;
  showControls?: boolean;
}

export default function MapSkeleton({
  className = "",
  height = "h-96",
  showControls = true,
}: MapSkeletonProps) {
  return (
    <div className={`relative ${height} ${className}`}>
      {/* Main map skeleton */}
      <Skeleton className="w-full h-full rounded-lg" />

      {/* Map controls */}
      {showControls && (
        <>
          {/* Zoom controls */}
          <div className="absolute top-4 right-4 space-y-2">
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>

          {/* Map type selector */}
          <div className="absolute top-4 left-4">
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>

          {/* Center/locate button */}
          <div className="absolute bottom-4 right-4">
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </>
      )}

      {/* Simulated markers */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            className="absolute"
            style={{
              top: `${20 + index * 15}%`,
              left: `${25 + index * 12}%`,
            }}
          >
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
        ))}
      </div>

      {/* Loading overlay */}
      <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center rounded-lg">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="text-sm text-gray-600">Loading map...</p>
        </div>
      </div>
    </div>
  );
}
