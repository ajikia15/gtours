import { Skeleton } from "@/components/ui/skeleton";

export default function TourDetailsCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 px-6 pb-6 pt-3 bg-white rounded-xl shadow-lg w-full min-w-84">
      <Skeleton className="h-6 w-1/2 mx-auto" /> {/* Title */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Skeleton className="size-5 rounded-full" />
          <Skeleton className="h-5 w-3/4" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="size-5 rounded-full" />
          <Skeleton className="h-5 w-2/3" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="size-5 rounded-full" />
          <Skeleton className="h-5 w-1/2" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="size-5 rounded-full" />
          <Skeleton className="h-5 w-1/2" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="size-5 rounded-full" />
          <Skeleton className="h-5 w-1/3" />
        </div>
      </div>
      <div className="mt-4">
        <Skeleton className="h-5 w-1/4" /> {/* Add Tour: */}
        <div className="flex items-center justify-between p-2 border border-gray-200 rounded-md mt-2">
          <Skeleton className="h-8 w-8" /> {/* Minus button */}
          <Skeleton className="h-5 w-1/3" /> {/* Adult Tour */}
          <Skeleton className="h-8 w-8" /> {/* Plus button */}
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <Skeleton className="h-6 w-1/2" /> {/* Total: Price GEL */}
      </div>
      <Skeleton className="h-10 w-full" /> {/* Add to Cart Button */}
      <Skeleton className="h-10 w-full" /> {/* Book Tour Button */}
    </div>
  );
}
