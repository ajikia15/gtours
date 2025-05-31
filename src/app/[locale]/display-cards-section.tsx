"use server";
import { getUserFavourites } from "@/data/favourites";
import MapTourCard from "./tour-card";
import { getTours } from "@/data/tours";
import FakeTimeoutForSkeletons from "@/lib/fakeTimeoutForSkeletons";

// export default function DisplayCardsSection({ tours }: { tours: Tour[] }) { // for passing props with tours
export default async function DisplayCardsSection() {
  const { data } = await getTours();
  await FakeTimeoutForSkeletons();

  const userFavourites = await getUserFavourites();
  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {data.slice(0, 4).map((tour) => (
        <div key={tour.id}>
          <MapTourCard
            tour={tour}
            isFavourite={userFavourites.includes(tour.id)}
          />
        </div>
      ))}
    </div>
  );
}
