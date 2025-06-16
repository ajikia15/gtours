import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface CardSkeletonProps {
  className?: string;
  showImage?: boolean;
  showActions?: boolean;
  lines?: number;
}

export default function CardSkeleton({
  className = "",
  showImage = true,
  showActions = true,
  lines = 3,
}: CardSkeletonProps) {
  return (
    <div
      className={cn(
        "flex flex-col h-full border border-gray-200 shadow-sm rounded-xl bg-white",
        className
      )}
    >
      {showImage && <Skeleton className="aspect-square w-full rounded-t-xl" />}

      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Title */}
        <Skeleton className="h-6 w-3/4" />

        {/* Description lines */}
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, i) => (
            <Skeleton
              key={i}
              className={cn("h-4", i === lines - 1 ? "w-2/3" : "w-full")}
            />
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 mt-4">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-9" />
          </div>
        )}
      </div>
    </div>
  );
}
