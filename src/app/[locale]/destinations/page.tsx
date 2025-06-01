import { getTranslations } from "next-intl/server";
import Header from "../header";
import { getTours } from "@/data/tours";
import { Suspense } from "react";
import TourCardSkeleton from "@/components/tour-card-skeleton";
import TourCard from "@/components/tour-card";
import ShortTourCard from "@/components/short-tour-card";
export default async function DestinationsPage() {
  const t = await getTranslations("Pages.destinations");
  const { data: tours } = await getTours({
    pagination: { page: 1, pageSize: 20 }, // Get more tours for selection
  });
  return (
    <>
      <Header title={t("title")} />
      <Suspense
        fallback={
          <div className="grid grid-cols-4 gap-4 mt-4">
            {Array.from({ length: 4 }, (_, index) => (
              <TourCardSkeleton key={`skeleton-${index}`} />
            ))}
          </div>
        }
      >
        <div className="grid grid-cols-4 gap-12 mt-4">
          {tours.map((tour) => (
            <div key={tour.id}>
              <ShortTourCard tour={tour} />
            </div>
          ))}
        </div>
      </Suspense>
    </>
  );
}
