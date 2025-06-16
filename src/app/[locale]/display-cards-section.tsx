"use server";
// import { getUserFavourites } from "@/data/favourites";
import { getTours } from "@/data/tours";
import FakeTimeoutForSkeletons from "@/lib/fakeTimeoutForSkeletons";
import TourCard from "@/components/tour-card";
import { Tour } from "@/types/Tour";

export default async function DisplayCardsSection({
  tours,
}: {
  tours?: Tour[];
}) {
  // If tours are passed as props, use them; otherwise fetch
  const data = tours || (await getTours()).data;
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
