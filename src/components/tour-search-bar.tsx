"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { Tour } from "@/types/Tour";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarDays,
  Users,
  MapPin,
  Activity,
  ChevronDown,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import TourDatePicker from "@/components/booking/tour-date-picker";
import TravelerSelection from "@/components/booking/traveler-selection";
import { getLocalizedTitle } from "@/lib/localizationHelpers";
import { useLocale } from "next-intl";

interface SearchFilters {
  destinations: string[];
  activities: string[];
  selectedDate?: Date; // Single date like in booking
  travelers: {
    adults: number;
    children: number;
    infants: number;
  };
  priceRange?: {
    min: number;
    max: number;
  };
}

interface TourSearchBarProps {
  tours: Tour[];
  onSearch?: (filters: SearchFilters, results: Tour[]) => void;
  className?: string;
}

interface DestinationSelectionContentProps {
  destinations: string[];
  selectedDestinations: string[];
  onDestinationToggle: (destination: string) => void;
}

interface ActivitySelectionContentProps {
  activities: [string, string][];
  selectedActivities: string[];
  onActivityToggle: (activityId: string) => void;
}

// Destination Selection Content Component
function DestinationSelectionContent({
  destinations,
  selectedDestinations,
  onDestinationToggle,
}: DestinationSelectionContentProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDestinations = destinations.filter((destination) =>
    destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-3">
      {/* Search Field */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search destinations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Selected Destinations Tags */}
      {selectedDestinations.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">
            Selected Destinations:
          </div>
          <div className="flex gap-1 overflow-x-auto pb-2">
            {selectedDestinations.map((destination) => (
              <Badge
                key={destination}
                variant="secondary"
                className="flex items-center gap-1 whitespace-nowrap"
              >
                {destination}
                <button
                  onClick={() => onDestinationToggle(destination)}
                  className="ml-1 hover:bg-gray-300 rounded"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Destination List */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {filteredDestinations.length > 0 ? (
          filteredDestinations.map((destination) => (
            <label
              key={destination}
              className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedDestinations.includes(destination)}
                onChange={() => onDestinationToggle(destination)}
                className="rounded"
              />
              <span className="text-sm">{destination}</span>
            </label>
          ))
        ) : (
          <div className="p-3 text-center text-gray-500">
            No destinations found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}

// Activity Selection Content Component
function ActivitySelectionContent({
  activities,
  selectedActivities,
  onActivityToggle,
}: ActivitySelectionContentProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredActivities = activities.filter(([, activityName]) =>
    activityName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-3">
      {/* Search Field */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search activities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Selected Activities Tags */}
      {selectedActivities.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">
            Selected Activities:
          </div>
          <div className="flex gap-1 overflow-x-auto pb-2">
            {selectedActivities.map((activityId) => {
              const activityName =
                activities.find(([id]) => id === activityId)?.[1] || activityId;
              return (
                <Badge
                  key={activityId}
                  variant="secondary"
                  className="flex items-center gap-1 whitespace-nowrap"
                >
                  {activityName}
                  <button
                    onClick={() => onActivityToggle(activityId)}
                    className="ml-1 hover:bg-gray-300 rounded"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Activity List */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {filteredActivities.length > 0 ? (
          filteredActivities.map(([activityId, activityName]) => (
            <label
              key={activityId}
              className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedActivities.includes(activityId)}
                onChange={() => onActivityToggle(activityId)}
                className="rounded"
              />
              <span className="text-sm">{activityName}</span>
            </label>
          ))
        ) : (
          <div className="p-3 text-center text-gray-500">
            No activities found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}

export default function TourSearchBar({
  tours,
  onSearch,
  className = "",
}: TourSearchBarProps) {
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filters from URL parameters
  const getInitialFilters = useCallback((): SearchFilters => {
    const destinations =
      searchParams.get("destinations")?.split(",").filter(Boolean) || [];
    const activities =
      searchParams.get("activities")?.split(",").filter(Boolean) || [];
    const dateParam = searchParams.get("date");
    const adultsParam = searchParams.get("adults");
    const childrenParam = searchParams.get("children");
    const infantsParam = searchParams.get("infants");

    return {
      destinations,
      activities,
      selectedDate: dateParam ? new Date(dateParam) : undefined,
      travelers: {
        adults: adultsParam ? parseInt(adultsParam) : 2,
        children: childrenParam ? parseInt(childrenParam) : 0,
        infants: infantsParam ? parseInt(infantsParam) : 0,
      },
    };
  }, [searchParams]);

  // Search state
  const [filters, setFilters] = useState<SearchFilters>(getInitialFilters);
  // UI state
  const [openPopover, setOpenPopover] = useState<string | null>(null);

  // Update filters when URL changes
  useEffect(() => {
    setFilters(getInitialFilters());
  }, [getInitialFilters]);

  // Get all unique destinations from tour titles
  const allDestinations = Array.from(
    new Set(
      tours.map((tour) => {
        const title = getLocalizedTitle(tour, locale);
        // Extract potential destination from title (before first dash or entire title)
        return title.split(" - ")[0] || title;
      })
    )
  ).sort();
  // Get all unique activities from tours, filtered by selected destinations
  const getAvailableActivities = () => {
    let relevantTours = tours;

    // If destinations are selected, filter tours by those destinations
    if (filters.destinations.length > 0) {
      relevantTours = tours.filter((tour) => {
        const localizedTitle = getLocalizedTitle(tour, locale);
        return filters.destinations.some((destination) =>
          localizedTitle.toLowerCase().includes(destination.toLowerCase())
        );
      });
    }

    // Get activities from the relevant tours
    return Array.from(
      relevantTours.reduce((acc, tour) => {
        tour.offeredActivities?.forEach((activity) => {
          acc.set(activity.activityTypeId, activity.nameSnapshot);
        });
        return acc;
      }, new Map<string, string>())
    );
  };

  const allActivities = getAvailableActivities();

  // Filter and search tours
  const filteredTours = tours.filter((tour) => {
    const localizedTitle = getLocalizedTitle(tour, locale);

    // Destination filter
    const matchesDestination =
      filters.destinations.length === 0 ||
      filters.destinations.some((destination) =>
        localizedTitle.toLowerCase().includes(destination.toLowerCase())
      );

    // Activities filter
    const matchesActivities =
      filters.activities.length === 0 ||
      filters.activities.some((activityId) =>
        tour.offeredActivities?.some(
          (offered) => offered.activityTypeId === activityId
        )
      );

    // Note: Date and travelers are for pre-filling shared state, not filtering
    // All tours are available at any time

    return matchesDestination && matchesActivities;
  }); // Handlers
  const handleDestinationToggle = (destination: string) => {
    setFilters((prev) => ({
      ...prev,
      destinations: prev.destinations.includes(destination)
        ? prev.destinations.filter((d) => d !== destination)
        : [...prev.destinations, destination],
    }));
    // Don't close the popover when selecting destinations
    // setOpenPopover(null);
  };

  const handleActivityToggle = (activityId: string) => {
    setFilters((prev) => ({
      ...prev,
      activities: prev.activities.includes(activityId)
        ? prev.activities.filter((id) => id !== activityId)
        : [...prev.activities, activityId],
    }));
  };
  const handleDateChange = (date: Date | undefined) => {
    setFilters((prev) => ({
      ...prev,
      selectedDate: date,
    }));
  };

  const handleTravelersChange = (travelers: typeof filters.travelers) => {
    setFilters((prev) => ({ ...prev, travelers }));
  };
  const handleSearch = () => {
    // Create URL search parameters
    const searchParams = new URLSearchParams();

    // Add destinations
    if (filters.destinations.length > 0) {
      searchParams.set("destinations", filters.destinations.join(","));
    }

    // Add activities
    if (filters.activities.length > 0) {
      searchParams.set("activities", filters.activities.join(","));
    }

    // Add date
    if (filters.selectedDate) {
      searchParams.set("date", filters.selectedDate.toISOString());
    }

    // Add travelers
    const { adults, children, infants } = filters.travelers;
    if (adults !== 2 || children > 0 || infants > 0) {
      searchParams.set("adults", adults.toString());
      if (children > 0) searchParams.set("children", children.toString());
      if (infants > 0) searchParams.set("infants", infants.toString());
    }

    // Navigate to destinations page with search parameters
    const searchString = searchParams.toString();
    const destinationUrl = searchString
      ? `/destinations?${searchString}`
      : "/destinations";

    router.push(destinationUrl);
    // Legacy callback for backward compatibility
    onSearch?.(filters, filteredTours);
  };

  const clearFilter = (filterType: keyof SearchFilters) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]:
        filterType === "activities" || filterType === "destinations"
          ? []
          : undefined,
    }));
  };

  // Display helpers
  const getDestinationDisplay = () => {
    if (filters.destinations.length === 0) return "Any destination";
    if (filters.destinations.length === 1) return filters.destinations[0];
    return `${filters.destinations.length} destinations`;
  };

  const getActivitiesDisplay = () => {
    if (filters.activities.length === 0) return "Any activities";
    return `${filters.activities.length} activit${
      filters.activities.length !== 1 ? "ies" : "y"
    }`;
  };
  const getDateDisplay = () => {
    if (filters.selectedDate) {
      return filters.selectedDate.toLocaleDateString();
    }
    return "Pre-fill date";
  };
  const getTravelersDisplay = () => {
    const total =
      filters.travelers.adults +
      filters.travelers.children +
      filters.travelers.infants;
    if (
      total === 2 &&
      filters.travelers.children === 0 &&
      filters.travelers.infants === 0
    ) {
      return "Pre-fill travelers"; // Default
    }
    return `${total} traveler${total !== 1 ? "s" : ""}`;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Search Bar */}
      <Card
        className={cn("overflow-hidden rounded-sm border-0 py-0 bg-zinc-900")}
      >
        <div className="flex divide-x divide-zinc-700">
          {/* Destination Section */}
          <Popover
            open={openPopover === "destination"}
            onOpenChange={(open) => setOpenPopover(open ? "destination" : null)}
          >
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "flex-1 pl-6 pr-4 py-3 text-left transition-colors hover:bg-zinc-800 cursor-pointer text-white bg-zinc-900"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-zinc-300" />
                  <span className="text-sm font-medium text-gray-100">
                    Destination
                  </span>
                  <ChevronDown className="h-4 w-4 text-zinc-300 ml-auto" />
                </div>
                <div className="text-xs truncate text-gray-300">
                  {getDestinationDisplay()}
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Select Destinations</h4>
                  {filters.destinations.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => clearFilter("destinations")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <DestinationSelectionContent
                  destinations={allDestinations}
                  selectedDestinations={filters.destinations}
                  onDestinationToggle={handleDestinationToggle}
                />
              </div>
            </PopoverContent>
          </Popover>

          {/* Activities Section */}
          <Popover
            open={openPopover === "activities"}
            onOpenChange={(open) => setOpenPopover(open ? "activities" : null)}
          >
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "flex-1 pl-6 pr-4 py-3 text-left transition-colors hover:bg-zinc-800 cursor-pointer text-white bg-zinc-900"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="h-4 w-4 text-zinc-300" />
                  <span className="text-sm font-medium text-gray-100">
                    Activities
                  </span>
                  <ChevronDown className="h-4 w-4 text-zinc-300 ml-auto" />
                </div>
                <div className="text-xs truncate text-gray-300">
                  {getActivitiesDisplay()}
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Select Activities</h4>
                  {filters.activities.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => clearFilter("activities")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <ActivitySelectionContent
                  activities={allActivities}
                  selectedActivities={filters.activities}
                  onActivityToggle={handleActivityToggle}
                />
              </div>
            </PopoverContent>
          </Popover>

          {/* Date Section */}
          <Popover
            open={openPopover === "date"}
            onOpenChange={(open) => setOpenPopover(open ? "date" : null)}
          >
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "flex-1 pl-6 pr-4 py-3 text-left transition-colors hover:bg-zinc-800 cursor-pointer text-white bg-zinc-900"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <CalendarDays className="h-4 w-4 text-zinc-300" />
                  <span className="text-sm font-medium text-gray-100">
                    Date
                  </span>
                  <ChevronDown className="h-4 w-4 text-zinc-300 ml-auto" />
                </div>
                <div className="text-xs truncate text-gray-300">
                  {getDateDisplay()}
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <TourDatePicker
                date={filters.selectedDate}
                setDate={handleDateChange}
              />
            </PopoverContent>
          </Popover>

          {/* Travelers Section */}
          <Popover
            open={openPopover === "travelers"}
            onOpenChange={(open) => setOpenPopover(open ? "travelers" : null)}
          >
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "flex-1 pl-6 pr-4 py-3 text-left transition-colors hover:bg-zinc-800 cursor-pointer text-white bg-zinc-900"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-zinc-300" />
                  <span className="text-sm font-medium text-gray-100">
                    Travelers
                  </span>
                  <ChevronDown className="h-4 w-4 text-zinc-300 ml-auto" />
                </div>
                <div className="text-xs truncate text-gray-300">
                  {getTravelersDisplay()}
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Select Travelers</h4>
                </div>
                <TravelerSelection
                  travelers={filters.travelers}
                  setTravelers={handleTravelersChange}
                />
              </div>
            </PopoverContent>
          </Popover>

          {/* Search Button */}
          <div className="px-8 flex items-center">
            <Button
              onClick={handleSearch}
              className="rounded-none px-6 py-3 bg-brand-secondary hover:bg-brand-secondary/90"
              size="lg"
            >
              Search
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Component Composition Variants
export function QuickTourSearch({ tours, ...props }: TourSearchBarProps) {
  return <TourSearchBar tours={tours} {...props} />;
}

export function CompactTourSearch({ tours, ...props }: TourSearchBarProps) {
  return <TourSearchBar tours={tours} {...props} />;
}

export function FullTourSearch({ tours, ...props }: TourSearchBarProps) {
  return <TourSearchBar tours={tours} {...props} />;
}
