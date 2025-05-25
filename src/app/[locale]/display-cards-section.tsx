import MapTourCard from "./svg-map-card";
import { getTours } from "@/data/tours";
import { Suspense } from "react";
import MapTourCardSkeleton from "@/components/ui/MapTourCardSkeleton";

// export default function DisplayCardsSection({ tours }: { tours: Tour[] }) { // for passing props with tours
export default async function DisplayCardsSection() {
  const { data } = await getTours();
  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      <Suspense
        fallback={
          <div className="grid grid-cols-4 gap-4 p-4">
            {Array.from({ length: 4 }, (_, index) => (
              <MapTourCardSkeleton key={`skeleton-${index}`} />
            ))}
          </div>
        }
      >
        {data.slice(0, 4).map((tour) => (
          <div key={tour.id}>
            <MapTourCard tour={tour} />
          </div>
        ))}
      </Suspense>
    </div>
  );
}
