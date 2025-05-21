export default function ImageSectionSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-4 w-full my-10 animate-pulse">
      {/* Column 1: Text placeholders and one image placeholder */}
      <div className="flex flex-col gap-4 aspect-[1/2]">
        <div className="flex flex-col gap-2">
          {/* Placeholder for Title */}
          <div className="h-8 bg-gray-300 rounded w-3/4"></div>
          <div className="flex flex-row gap-2 text-lg">
            <div className="w-4 bg-gray-300 my-1.5"></div>
            <div className="w-full">
              {/* Placeholder for "Explore" */}
              <div className="h-6 bg-gray-300 rounded w-1/2 mb-1"></div>
              {/* Placeholder for "Tbilisi's" */}
              <div className="h-6 bg-gray-300 rounded w-3/5 mb-1"></div>
              {/* Placeholder for "Wonders" */}
              <div className="h-6 bg-gray-300 rounded w-1/3"></div>
            </div>
          </div>
        </div>
        {/* Placeholder for Image - flex-1 makes it take remaining space */}
        <div className="relative w-full flex-1 rounded-xl bg-gray-300"></div>
      </div>

      {/* Column 2: 2 Image Placeholders - flex-1 makes them share space equally */}
      <div className="flex flex-col gap-4 aspect-[1/2]">
        <div className="relative w-full flex-1 rounded-xl bg-gray-300"></div>
        <div className="relative w-full flex-1 rounded-xl bg-gray-300"></div>
      </div>

      {/* Column 3: 2 Image Placeholders with different grow factors */}
      <div className="flex flex-col gap-4 aspect-[1/2]">
        <div className="relative w-full grow-[3] rounded-xl bg-gray-300"></div>
        <div className="relative w-full grow-[2] rounded-xl bg-gray-300"></div>
      </div>

      {/* Column 4: 2 Image Placeholders, one is a link placeholder, with different grow factors */}
      <div className="flex flex-col gap-4 aspect-[1/2]">
        <div className="relative w-full grow-[4] rounded-xl bg-gray-300"></div>
        <div className="relative w-full grow rounded-xl bg-gray-300">
          {/* Placeholder for "View More" text, slightly darker */}
          <div className="absolute inset-0 bg-gray-400/75 flex items-center justify-center rounded-xl">
            <div className="h-6 bg-gray-500 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
