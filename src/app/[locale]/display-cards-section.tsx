"use server";
// import { getUserFavourites } from "@/data/favourites";
import { getTours } from "@/data/tours";
import FakeTimeoutForSkeletons from "@/lib/fakeTimeoutForSkeletons";
import TourCard from "@/components/tour-card";
// export default function DisplayCardsSection({ tours }: { tours: Tour[] }) { // for passing props with tours
export default async function DisplayCardsSection() {
  const { data } = await getTours();
  await FakeTimeoutForSkeletons();

  // const userFavourites = await getUserFavourites();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {data.slice(0, 4).map((tour) => (
        <div key={tour.id}>
          <TourCard
            tour={tour}
            // isFavourite={userFavourites.includes(tour.id)}
          />
        </div>
      ))}
    </div>
  );
}
