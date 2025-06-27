import { getTours } from "@/data/tours";
import ResponsiveTourSearchBar from "@/components/responsive-tour-search-bar";

export default async function SearchBarContent() {
  const { data: allTours } = await getTours({
    pagination: { page: 1, pageSize: 100 }, // Get more tours for search
  });

  return <ResponsiveTourSearchBar tours={allTours} className="my-8 max-w-4xl mx-auto" />;
}
