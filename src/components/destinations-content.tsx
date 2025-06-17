import ShortTourCard from "@/components/short-tour-card";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Tour } from "@/types/Tour";

interface SearchParams {
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
  const sortBy = searchParams.sortBy || "price";
  const sortOrder = searchParams.sortOrder || "desc";
  
  // Apply client-side sorting to the tours
  const sortedTours = [...tours].sort((a, b) => {
    if (sortBy === "alphabetical") {
      const localeIndex = locale === 'en' ? 0 : locale === 'ge' ? 1 : 2;
      const titleA = a.title[localeIndex] || a.title[0] || '';
      const titleB = b.title[localeIndex] || b.title[0] || '';
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

  // Generate sorting URLs for buttons
  const generateSortUrl = (newSortBy: "price" | "alphabetical", newSortOrder?: "asc" | "desc") => {
    const params = new URLSearchParams();
    
    // Set sorting params
    params.set("sortBy", newSortBy);
    
    // If same sort type, toggle order; otherwise use provided order or default
    if (newSortBy === sortBy) {
      const toggledOrder = sortOrder === "asc" ? "desc" : "asc";
      params.set("sortOrder", newSortOrder || toggledOrder);
    } else {
      params.set("sortOrder", newSortOrder || (newSortBy === "price" ? "desc" : "asc"));
    }
    
    return `?${params.toString()}`;
  };
  return (
    <>
      {/* Sorting Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {sortedTours.length} tour{sortedTours.length !== 1 ? "s" : ""} available
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            variant={sortBy === "price" ? "default" : "outline"}
            size="sm"
            className="text-xs"
            asChild
          >
            <Link href={generateSortUrl("price")}>
              <ArrowUpDown className="h-3 w-3 mr-1" />
              Price {sortBy === "price" ? (sortOrder === "desc" ? "↓" : "↑") : ""}
            </Link>
          </Button>
          <Button
            variant={sortBy === "alphabetical" ? "default" : "outline"}
            size="sm"
            className="text-xs"
            asChild
          >
            <Link href={generateSortUrl("alphabetical")}>
              <ArrowUpDown className="h-3 w-3 mr-1" />
              A-Z {sortBy === "alphabetical" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </Link>
          </Button>
        </div>
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
