"use server";
import { Suspense } from "react";
import { getLocale } from "next-intl/server";
import { isMobile } from "@/lib/isMobile";
import { headers } from "next/headers";
import TourContent from "./tour-content";
import ImageSectionSkeleton from "./image-section-skeleton";
import TextSectionSkeleton from "./text-section-skeleton";
import TourDetailsCardSkeleton from "./tour-details-card-skeleton";
import { getTours } from "@/data/tours";

// Generate static params for all tours to enable instant navigation
export async function generateStaticParams() {
  try {
    const result = await getTours();
    return result.data.map((tour) => ({
      tourId: tour.id,
    }));
  } catch (error) {
    console.error("Error generating static params for tours:", error);
    return [];
  }
}

export default async function TourPage({
  params,
}: {
  params: Promise<{ tourId: string }>;
}) {
  const locale = await getLocale();
  const { tourId } = await params;
  const userAgent = (await headers()).get("user-agent") || "";
  const mobile = isMobile(userAgent);

  return (
    <div className="relative">
      <Suspense
        fallback={
          <div className="relative">
            <ImageSectionSkeleton />
            <div className="flex flex-row md:gap-10 items-start px-6 md:px-0">
              <div className="flex flex-col gap-4 md:gap-8 h-full w-full">
                <TextSectionSkeleton />
              </div>
              <div className="sticky top-22 flex-1">
                <div className="hidden md:block">
                  <TourDetailsCardSkeleton />
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
