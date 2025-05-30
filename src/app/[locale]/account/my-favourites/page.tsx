import { getUserFavourites } from "@/data/favourites";
import { getToursById } from "@/data/tours";
import MapTourCard from "../../svg-map-card";

export default async function FavouritesPage() {
  try {
    const favourites = await getUserFavourites();

    // Guard: Check if favourites exist and has items
    if (!favourites || favourites.length === 0) {
      return (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">My Favourites</h1>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              You haven&apos;t added any tours to your favourites yet.
            </p>
            <p className="text-gray-400 mt-2">
              Start exploring tours and add them to your favourites!
            </p>
          </div>
        </div>
      );
    }

    const tours = await getToursById(favourites);

    // Guard: Check if tours were successfully fetched
    if (!tours || tours.length === 0) {
      return (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">My Favourites</h1>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Unable to load your favourite tours.
            </p>
            <p className="text-gray-400 mt-2">Please try again later.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Favourites</h1>
        <p className="text-gray-600 mb-8">
          You have {tours.length} favourite tour{tours.length !== 1 ? "s" : ""}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <MapTourCard
              key={tour.id}
              tour={tour}
              isFavourite={favourites.includes(tour.id)}
            />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading favourites:", error);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Favourites</h1>
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">
            Something went wrong while loading your favourites.
          </p>
          <p className="text-gray-400 mt-2">
            Please refresh the page or try again later.
          </p>
        </div>
      </div>
    );
  }
}
