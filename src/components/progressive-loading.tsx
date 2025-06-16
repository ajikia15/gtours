"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProgressiveLoadingProps {
  isLoading: boolean;
  itemCount: number;
  children: React.ReactNode;
}

export default function ProgressiveLoading({
  isLoading,
  itemCount,
  children,
}: ProgressiveLoadingProps) {
  const [visibleSkeletons, setVisibleSkeletons] = useState(4);

  useEffect(() => {
    if (!isLoading) return;

    const intervals = [
      setTimeout(() => setVisibleSkeletons(8), 500),
      setTimeout(() => setVisibleSkeletons(12), 1000),
      setTimeout(() => setVisibleSkeletons(16), 1500),
    ];

    return () => intervals.forEach(clearTimeout);
  }, [isLoading]);

  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from(
        { length: Math.min(visibleSkeletons, itemCount) },
        (_, index) => (
          <div
            key={`skeleton-${index}`}
            className={`
            ${index < 4 ? "animate-pulse" : ""}
            ${index >= 4 && index < 8 ? "animate-pulse-delayed" : ""}
            ${index >= 8 ? "animate-skeleton-wave" : ""}
          `}
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <div className="flex flex-col h-full border border-gray-300 shadow-sm rounded-xl">
              <Skeleton className="aspect-square w-full rounded-t-xl" />
              <div className="flex flex-col gap-2 p-6">
                <Skeleton className="h-6 w-2/3 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-5/6 mb-1" />
                <Skeleton className="h-4 w-3/4 mb-3" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
