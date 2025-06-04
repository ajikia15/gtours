import { getTranslations } from "next-intl/server";
import Header from "../header";
import { getTours } from "@/data/tours";
import { Suspense } from "react";
import TourCardSkeleton from "@/components/tour-card-skeleton";
import ShortTourCard from "@/components/short-tour-card";
import BookingBar from "@/components/booking-bar";
export default async function DestinationsPage() {
  const t = await getTranslations("Pages.destinations");
  const { data: tours } = await getTours({
    pagination: { page: 1, pageSize: 20 }, // Get more tours for selection
  });
  return (
    <>
      <Header title={t("title")} />
      <h2 className="text-2xl font-bold my-8 text-center">მოძებნე</h2>
      <BookingBar tours={tours} className="my-8 max-w-4xl" />
      <section className="grid grid-cols-4 gap-4 mt-4">
        <Suspense
          fallback={Array.from({ length: 4 }, (_, index) => (
            <TourCardSkeleton key={`skeleton-${index}`} />
          ))}
        >
          {tours.map((tour) => (
            <div key={tour.id}>
              <ShortTourCard tour={tour} />
            </div>
          ))}
        </Suspense>
      </section>
    </>
  );
}
