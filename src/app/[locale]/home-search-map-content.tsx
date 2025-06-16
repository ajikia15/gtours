import { getTours } from "@/data/tours";
import TourSearchBar from "@/components/tour-search-bar";
import InteractiveMapSection from "./interactive-map-section";

export default async function HomeSearchAndMapContent() {
  const { data: tours } = await getTours({
    pagination: { page: 1, pageSize: 20 }, // Get tours for search and map
  });

  return (
    <>
      <div className="absolute left-0 right-0 bottom-0 flex justify-center pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-4xl px-4"
          style={{
            transform: "translateY(50%)",
          }}
        >
          <TourSearchBar tours={tours} className="shadow-lg" />
        </div>
      </div>
      <InteractiveMapSection tours={tours} />
    </>
  );
}
