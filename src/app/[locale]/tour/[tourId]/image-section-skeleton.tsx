import { Skeleton } from "@/components/ui/skeleton";

export default function ImageSectionSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-4 w-full my-10">
      {/* Column 1: Text placeholders and one image placeholder */}
      <div className="flex flex-col gap-4 aspect-[1/2]">
        <div className="flex flex-col gap-2">
          {/* Placeholder for Title */}
          <Skeleton className="h-8 w-3/4" />
          <div className="flex flex-row gap-2 text-lg">
            <Skeleton className="w-4 h-6" />
            <div className="w-full">
              {/* Placeholder for "Explore" */}
              <Skeleton className="h-6 w-1/2 mb-1" />
              {/* Placeholder for "Tbilisi's" */}
              <Skeleton className="h-6 w-3/5 mb-1" />
              {/* Placeholder for "Wonders" */}
              <Skeleton className="h-6 w-1/3" />
            </div>
          </div>
        </div>
        {/* Placeholder for Image - flex-1 makes it take remaining space */}
        <Skeleton className="w-full flex-1 rounded-xl" />
      </div>

      {/* Column 2: 2 Image Placeholders - flex-1 makes them share space equally */}
      <div className="flex flex-col gap-4 aspect-[1/2]">
        <Skeleton className="w-full flex-1 rounded-xl" />
        <Skeleton className="w-full flex-1 rounded-xl" />
      </div>

      {/* Column 3: 2 Image Placeholders with different grow factors */}
      <div className="flex flex-col gap-4 aspect-[1/2]">
        <Skeleton className="w-full grow-[3] rounded-xl" />
        <Skeleton className="w-full grow-[2] rounded-xl" />
      </div>

      {/* Column 4: 2 Image Placeholders, one is a link placeholder */}
      <div className="flex flex-col gap-4 aspect-[1/2]">
        <Skeleton className="w-full grow-[4] rounded-xl" />
        <div className="relative w-full grow">
          <Skeleton className="w-full h-full rounded-xl" />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-xl">
            <Skeleton className="h-6 w-1/3" />
          </div>
        </div>
      </div>
    </div>
  );
}
