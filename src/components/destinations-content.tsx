import ShortTourCard from "@/components/short-tour-card";
import { Tour } from "@/types/Tour";
import SortingButtons from "@/components/sorting-buttons";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Link } from "@/i18n/navigation";

interface SearchParams {
  destinations?: string;
  activities?: string;
  date?: string;
  adults?: string;
  children?: string;
  infants?: string;
  sortBy?: "price" | "alphabetical";
  sortOrder?: "asc" | "desc";
}

interface DestinationsContentProps {
  tours: Tour[];
  searchParams: SearchParams;
  locale: string;
}

export default function DestinationsContent({
  tours,
  searchParams,
  locale,
}: DestinationsContentProps) {
  const destinationFilters = searchParams.destinations?.split(",") || [];
  const activityFilters = searchParams.activities?.split(",") || [];
  const sortBy = searchParams.sortBy || "price";
  const sortOrder = searchParams.sortOrder || "desc";

  // Apply client-side filtering to the tours
  let filteredTours = tours;

  if (destinationFilters.length > 0) {
    filteredTours = filteredTours.filter((tour: Tour) => {
      const localeIndex = locale === "en" ? 0 : locale === "ge" ? 1 : 2;
      const title = tour.title[localeIndex] || tour.title[0] || "";
      return destinationFilters.some((destination) =>
        title.toLowerCase().includes(destination.toLowerCase())
      );
    });
  }

  if (activityFilters.length > 0) {
    filteredTours = filteredTours.filter((tour: Tour) =>
      activityFilters.some((activityId) =>
        tour.offeredActivities?.some(
          (offered) => offered.activityTypeId === activityId
        )
      )
    );
  }

  // Apply client-side sorting to the filtered tours
  const sortedTours = [...filteredTours].sort((a, b) => {
    if (sortBy === "alphabetical") {
      const localeIndex = locale === "en" ? 0 : locale === "ge" ? 1 : 2;
      const titleA = a.title[localeIndex] || a.title[0] || "";
      const titleB = b.title[localeIndex] || b.title[0] || "";
      return sortOrder === "asc"
        ? titleA.localeCompare(titleB)
        : titleB.localeCompare(titleA);
    } else {
      // Sort by price
      return sortOrder === "asc"
        ? a.basePrice - b.basePrice
        : b.basePrice - a.basePrice;
    }
  });

  const hasFilters =
    destinationFilters.length > 0 || activityFilters.length > 0;

  return (
    <>
      {/* Sorting Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {hasFilters && (
            <Button variant="outline" size="sm" className="text-xs" asChild>
              <Link href="/destinations">
                <X className="h-3 w-3 mr-1" />
                Reset Filters
              </Link>
            </Button>
          )}
        </div>
        <SortingButtons currentSortBy={sortBy} currentSortOrder={sortOrder} />
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
        {sortedTours.map((tour) => (
          <div key={tour.id}>
            <ShortTourCard tour={tour} />
          </div>
        ))}
      </section>

      {sortedTours.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No tours available</p>
        </div>
      )}
    </>
  );
}
