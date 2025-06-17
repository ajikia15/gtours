import { getTours } from "@/data/tours";
import TourSearchBar from "@/components/tour-search-bar";

export default async function SearchBarContent() {
  const { data: allTours } = await getTours({
    pagination: { page: 1, pageSize: 100 }, // Get more tours for search
  });

  return <TourSearchBar tours={allTours} className="my-8 max-w-4xl mx-auto" />;
}
