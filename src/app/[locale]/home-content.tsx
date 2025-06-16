import Carousel from "@/components/carousel/Carousel";
import QuickCategory from "@/components/carousel/QuickCategory";
import { getTranslations } from "next-intl/server";
import DisplayCardsSection from "./display-cards-section";
import { getTours } from "@/data/tours";
import InteractiveMapSection from "./interactive-map-section";
import TourSearchBar from "@/components/tour-search-bar";

export default async function HomeContent() {
  const t = await getTranslations("Homepage");

  // Fetch tours once for the entire page
  const { data: tours } = await getTours({
    pagination: { page: 1, pageSize: 20 }, // Get more tours for selection
  });

  return (
    <div className="space-y-10 mb-10">
      <div className="relative">
        <Carousel />
        <div className="absolute left-0 right-0 bottom-0 flex justify-center pointer-events-none">
          <div
            className="pointer-events-auto w-full max-w-4xl px-4"
            style={{
              transform: "translateY(50%)",
            }}
          >
            {" "}
            <TourSearchBar tours={tours} className="shadow-lg" />
          </div>
        </div>
      </div>
      <h1 className="text-center my-8 text-2xl font-bold">{t("activities")}</h1>
      <QuickCategory />

      <h1 className="text-center my-8 text-2xl font-bold">
        {t("discover-georgia")}
      </h1>

      {/* Pass tours to avoid duplicate fetching */}
      <DisplayCardsSection tours={tours.slice(0, 4)} />

      <InteractiveMapSection tours={tours} />
    </div>
  );
}
