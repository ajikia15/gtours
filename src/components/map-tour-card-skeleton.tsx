import React from "react";

export default function MapTourCardSkeleton(props: { className?: string }) {
  return (
    <div
      className={`flex flex-col w-full lg:w-80 xl:w-96 border border-gray-300 shadow-sm rounded-xl bg-white animate-pulse ${props.className}`}
    >
      {/* Image skeleton */}
      <div className="aspect-[4/3] w-full relative overflow-hidden rounded-t-xl bg-gray-300 dark:bg-gray-700" />

      <div className="flex flex-col gap-3 p-6">
        {/* Title skeleton */}
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-2/3" />

        {/* Description skeleton (3 lines to match line-clamp-3) */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full" />
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6" />
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
        </div>

        {/* "View Tour" link skeleton */}
        <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-20" />
      </div>
    </div>
  );
}
