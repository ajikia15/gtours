import { Suspense } from "react";
import { headers } from "next/headers";
import { getLocale } from "next-intl/server";
import { isMobile } from "@/lib/isMobile";
import TextSectionSkeleton from "./text-section-skeleton";
import TourDetailsCardSkeleton from "./tour-details-card-skeleton";
import TourContent from "./tour-content";

// This is the main page component - it should be minimal and delegate to streaming components
export default async function TourPage({
  params,
}: {
  params: Promise<{ tourId: string }>;
}) {
  // Only get the minimal data needed for the shell
  const { tourId } = await params;
  const locale = await getLocale();
  const userAgent = (await headers()).get("user-agent") || "";
  const mobile = isMobile(userAgent);

  return (
    <div className="relative">
      {/* The entire tour content is wrapped in a single Suspense boundary */}
      {/* This ensures the loading.tsx is shown during the data fetch */}
      <Suspense
        fallback={
          <div className="relative">
            {/* Image Section Skeleton */}
            <div className="grid grid-cols-4 gap-4 w-full my-10">
              <div className="flex flex-col gap-4 aspect-[1/2]">
                <div className="flex flex-col gap-2">
                  <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
                  <div className="flex flex-row gap-2 text-lg">
                    <div className="w-4 h-6 bg-gray-200 rounded animate-pulse" />
                    <div className="w-full space-y-1">
                      <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
                      <div className="h-6 bg-gray-200 rounded w-3/5 animate-pulse" />
                      <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
                    </div>
                  </div>
                </div>
                <div className="w-full flex-1 bg-gray-200 rounded-xl animate-pulse" />
              </div>
              {/* More skeleton columns */}
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="flex flex-col gap-4 aspect-[1/2]">
                  <div className="w-full flex-1 bg-gray-200 rounded-xl animate-pulse" />
                  <div className="w-full flex-1 bg-gray-200 rounded-xl animate-pulse" />
                </div>
              ))}
            </div>

            <div className="container mx-auto px-4 py-8">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                  <TextSectionSkeleton />
                  <div className="mt-8">
                    <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse" />
                    <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
                  </div>
                </div>
                <div className="lg:w-96">
                  <div className="sticky top-24">
                    <TourDetailsCardSkeleton />
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      >
        <TourContent tourId={tourId} locale={locale} mobile={mobile} />
      </Suspense>
    </div>
  );
}
