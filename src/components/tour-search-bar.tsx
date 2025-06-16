"use client";

import { useState } from "react";
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
import { useBooking } from "@/context/booking";

interface SearchFilters {
  destination?: string;
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
  onTourSelect?: (tour: Tour) => void;
  className?: string;
  placeholder?: string;
  showResults?: boolean;
}

interface DestinationSelectionContentProps {
  destinations: string[];
  selectedDestination: string | undefined;
  onDestinationSelect: (destination: string) => void;
}

interface ActivitySelectionContentProps {
  activities: [string, string][];
  selectedActivities: string[];
  onActivityToggle: (activityId: string) => void;
}

// Destination Selection Content Component
function DestinationSelectionContent({
  destinations,
  selectedDestination,
  onDestinationSelect,
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

      {/* Destination List */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {filteredDestinations.length > 0 ? (
          filteredDestinations.map((destination) => (
            <button
              key={destination}
              onClick={() => onDestinationSelect(destination)}
              className={cn(
                "w-full p-3 text-left rounded-lg border transition-colors",
                selectedDestination === destination
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <div className="font-medium">{destination}</div>
            </button>
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
  onTourSelect,
  className = "",
  placeholder = "Search destinations, tours, activities...",
  showResults = true,
}: TourSearchBarProps) {
  const locale = useLocale();
  const booking = useBooking();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({
    activities: [],
    travelers: { adults: 2, children: 0, infants: 0 },
  });

  // UI state
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const [showSearchResults, setShowSearchResults] = useState(false);

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

  // Get all unique activities from tours
  const allActivities = Array.from(
    tours.reduce((acc, tour) => {
      tour.offeredActivities?.forEach((activity) => {
        acc.set(activity.activityTypeId, activity.nameSnapshot);
      });
      return acc;
    }, new Map<string, string>())
  );
  // Filter and search tours
  const filteredTours = tours.filter((tour) => {
    const localizedTitle = getLocalizedTitle(tour, locale);
    
    // Text search
    const matchesSearch = searchQuery
      ? localizedTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.offeredActivities?.some((activity) =>
          activity.nameSnapshot.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : true;

    // Destination filter
    const matchesDestination = filters.destination
      ? localizedTitle.toLowerCase().includes(filters.destination.toLowerCase())
      : true;

    // Activities filter
    const matchesActivities =
      filters.activities.length === 0 ||
      filters.activities.some((activityId) =>
        tour.offeredActivities?.some((offered) => offered.activityTypeId === activityId)
      );

    // Note: Date and travelers are for pre-filling shared state, not filtering
    // All tours are available at any time

    return matchesSearch && matchesDestination && matchesActivities;
  });

  // Handlers
  const handleDestinationSelect = (destination: string) => {
    setFilters((prev) => ({ ...prev, destination }));
    setOpenPopover(null);
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
    const searchFilters: SearchFilters = {
      ...filters,
      destination: filters.destination || searchQuery || undefined,
    };
    
    onSearch?.(searchFilters, filteredTours);
    setShowSearchResults(showResults);
  };  const handleTourSelect = (tour: Tour) => {
    // Pre-fill shared booking state with selected date and travelers
    if (filters.selectedDate) {
      booking.updateSharedDate(filters.selectedDate);
    }
    if (filters.travelers.adults !== 2 || filters.travelers.children > 0 || filters.travelers.infants > 0) {
      booking.updateSharedTravelers(filters.travelers);
    }
    
    onTourSelect?.(tour);
    setOpenPopover(null);
    setShowSearchResults(false);
  };

  const clearFilter = (filterType: keyof SearchFilters) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: filterType === "activities" ? [] : undefined,
    }));
  };

  // Display helpers
  const getDestinationDisplay = () => {
    return filters.destination || "Any destination";
  };

  const getActivitiesDisplay = () => {
    if (filters.activities.length === 0) return "Any activities";
    return `${filters.activities.length} activit${
      filters.activities.length !== 1 ? "ies" : "y"
    }`;
  };  const getDateDisplay = () => {
    if (filters.selectedDate) {
      return filters.selectedDate.toLocaleDateString();
    }
    return "Pre-fill date";
  };
  const getTravelersDisplay = () => {
    const total = filters.travelers.adults + filters.travelers.children + filters.travelers.infants;
    if (total === 2 && filters.travelers.children === 0 && filters.travelers.infants === 0) {
      return "Pre-fill travelers"; // Default
    }
    return `${total} traveler${total !== 1 ? "s" : ""}`;
  };
  const hasActiveFilters = Boolean(
    filters.destination ||
    filters.activities.length > 0 ||
    filters.selectedDate ||
    filters.travelers.adults !== 2 ||
    filters.travelers.children > 0 ||
    filters.travelers.infants > 0
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Search Bar */}
      <Card
        className={cn(
          "overflow-hidden rounded-sm border-0 py-0 bg-zinc-900"
        )}
      >
        <div className="flex divide-x divide-zinc-700">
          {/* Search Input Section */}
          <div className="flex-2 p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 bg-transparent border-0 text-white placeholder-gray-400 focus:ring-0"
              />
            </div>
          </div>

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
                  <h4 className="font-medium">Select Destination</h4>
                  {filters.destination && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => clearFilter("destination")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <DestinationSelectionContent
                  destinations={allDestinations}
                  selectedDestination={filters.destination}
                  onDestinationSelect={handleDestinationSelect}
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
                  <span className="text-sm font-medium text-gray-100">Date</span>
                  <ChevronDown className="h-4 w-4 text-zinc-300 ml-auto" />
                </div>
                <div className="text-xs truncate text-gray-300">
                  {getDateDisplay()}
                </div>
              </button>
            </PopoverTrigger>            <PopoverContent className="w-auto p-0" align="start">
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
            <PopoverContent className="w-80" align="start">              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Select Travelers</h4>
                  <div className="text-xs text-gray-500">For pre-filling bookings</div>
                  {(filters.travelers.adults !== 2 ||
                    filters.travelers.children > 0 ||
                    filters.travelers.infants > 0) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFilters((prev) => ({
                          ...prev,
                          travelers: { adults: 2, children: 0, infants: 0 },
                        }));
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
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

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.destination && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.destination}
              <button
                onClick={() => clearFilter("destination")}
                className="ml-1 hover:bg-gray-300 rounded"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.activities.map((activityId) => {
            const activityName = allActivities.find(([id]) => id === activityId)?.[1] || activityId;
            return (
              <Badge key={activityId} variant="secondary" className="flex items-center gap-1">
                {activityName}
                <button
                  onClick={() => handleActivityToggle(activityId)}
                  className="ml-1 hover:bg-gray-300 rounded"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}          {filters.selectedDate && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Date: {filters.selectedDate.toLocaleDateString()}
              <button
                onClick={() => setFilters((prev) => ({ ...prev, selectedDate: undefined }))}
                className="ml-1 hover:bg-gray-300 rounded"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Search Results */}
      {showSearchResults && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">
              {filteredTours.length} tour{filteredTours.length !== 1 ? "s" : ""} found
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSearchResults(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {filteredTours.length > 0 ? (
            <div className="space-y-3">
              {filteredTours.slice(0, 10).map((tour) => (
                <button
                  key={tour.id}
                  onClick={() => handleTourSelect(tour)}
                  className="w-full p-3 text-left rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        {getLocalizedTitle(tour, locale)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {tour.duration} days • From {tour.basePrice} GEL
                      </div>
                      {tour.offeredActivities && tour.offeredActivities.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {tour.offeredActivities.slice(0, 3).map((activity) => (
                            <Badge key={activity.activityTypeId} variant="outline" className="text-xs">
                              {activity.nameSnapshot}
                            </Badge>
                          ))}
                          {tour.offeredActivities.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{tour.offeredActivities.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{tour.basePrice} GEL</div>
                      <div className="text-xs text-gray-500">per person</div>
                    </div>
                  </div>
                </button>
              ))}
              {filteredTours.length > 10 && (
                <div className="text-sm text-gray-500 text-center p-2 border-t">
                  +{filteredTours.length - 10} more results. Use filters to narrow down.
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No tours found matching your criteria.</p>
              <p className="text-sm">Try adjusting your search or filters.</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

// Component Composition Variants
export function QuickTourSearch({ tours, ...props }: Omit<TourSearchBarProps, "showResults">) {
  return <TourSearchBar tours={tours} showResults={false} {...props} />;
}

export function CompactTourSearch({ tours, ...props }: TourSearchBarProps) {
  return <TourSearchBar tours={tours} {...props} />;
}

export function FullTourSearch({ tours, ...props }: TourSearchBarProps) {
  return <TourSearchBar tours={tours} showResults={true} {...props} />;
}
