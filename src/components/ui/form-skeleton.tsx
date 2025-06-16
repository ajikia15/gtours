import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface FormSkeletonProps {
  className?: string;
  fields?: number;
  showSubmit?: boolean;
  title?: boolean;
}

export default function FormSkeleton({
  className = "",
  fields = 4,
  showSubmit = true,
  title = true,
}: FormSkeletonProps) {
  return (
    <div className={cn("space-y-6 w-full", className)}>
      {/* Form title */}
      {title && <Skeleton className="h-8 w-48" />}

      {/* Form fields */}
      <div className="space-y-4">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            {/* Field label */}
            <Skeleton className="h-4 w-20" />
            {/* Field input */}
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>

      {/* Submit section */}
      {showSubmit && (
        <div className="pt-4 space-y-3">
          <Skeleton className="h-12 w-full" />
          <div className="text-center">
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
        </div>
      )}
    </div>
  );
}
