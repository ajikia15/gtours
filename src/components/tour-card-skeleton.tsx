import React from "react";

export default function TourCardSkeleton(props: { className?: string }) {
  return (
    <div
      className={`flex flex-col h-full border border-gray-300 shadow-sm rounded-xl animate-pulse ${props.className}`}
    >
      {/* Image skeleton */}
      <div className="aspect-square w-full relative rounded-xl bg-gray-300 dark:bg-gray-700" />
      <div className="flex flex-col gap-2 p-6">
        {/* Title skeleton */}
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mb-2" />
        {/* Description skeleton (3 lines) */}
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mb-1" />
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6 mb-1" />
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-3" />
        {/* Button skeleton */}
        <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-24" />
      </div>
    </div>
  );
}
