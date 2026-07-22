import { getUserFavourites } from "@/data/favourites";
import { getToursById } from "@/data/tours";
import MapTourCard from "../../../../components/tour-card";
import { getTranslations } from "next-intl/server";

export default async function FavouritesPage() {
  const t = await getTranslations("Favorites");

  try {
    const favourites = await getUserFavourites();

    // Guard: Check if favourites exist and has items
    if (!favourites || favourites.length === 0) {
      return (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">{t("myFavourites")}</h1>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t("noFavouritesYet")}</p>
            <p className="text-gray-400 mt-2">{t("startExploring")}</p>
          </div>
        </div>
      );
    }

    const tours = await getToursById(favourites);

    // Guard: Check if tours were successfully fetched
    if (!tours || tours.length === 0) {
      return (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">{t("myFavourites")}</h1>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t("unableToLoad")}</p>
            <p className="text-gray-400 mt-2">{t("tryAgainLater")}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">{t("myFavourites")}</h1>
        <p className="text-gray-600 mb-8">
          {t("favouriteCount", { count: tours.length })}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <MapTourCard
              key={tour.id}
              tour={tour}
              // isFavourite={favourites.includes(tour.id)}
            />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading favourites:", error);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">{t("myFavourites")}</h1>
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">{t("somethingWrong")}</p>
          <p className="text-gray-400 mt-2">{t("refreshPage")}</p>
        </div>
      </div>
    );
  }
}
