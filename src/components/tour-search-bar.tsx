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
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import TourDatePicker from "@/components/booking/tour-date-picker";
import TravelerSelection from "@/components/booking/traveler-selection";
import { useTourSearch, SearchFilters } from "@/hooks/use-tour-search";

interface TourSearchBarProps {
  tours: Tour[];
  onSearch?: (filters: SearchFilters, results: Tour[]) => void;
  className?: string;
  compact?: boolean;
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
export function DestinationSelectionContent({
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
export function ActivitySelectionContent({
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
  compact = false,
}: TourSearchBarProps) {
  // UI state
  const [openPopover, setOpenPopover] = useState<string | null>(null);

  // Use the extracted search logic
  const {
    filters,
    allDestinations,
    allActivities,
    handleDestinationToggle,
    handleActivityToggle,
    handleDateChange,
    handleTravelersChange,
    handleSearch,
    clearFilter,
    getDestinationDisplay,
    getActivitiesDisplay,
    getDateDisplay,
    getTravelersDisplay,
  } = useTourSearch({ tours, onSearch });

  const colDivider =
    "relative before:absolute before:left-0 before:top-3 before:bottom-3 before:w-px before:bg-zinc-700";

  return (
    <div
      className={cn("space-y-4", compact && "mx-auto w-fit", className)}
    >
      {/* Main Search Bar */}
      <Card
        className={cn("overflow-hidden rounded-2xl border-0 py-0 bg-zinc-900")}
      >
        <div className="flex">
          {/* Destination Section */}
          <Popover
            open={openPopover === "destination"}
            onOpenChange={(open) => setOpenPopover(open ? "destination" : null)}
          >
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "pl-6 pr-4 py-3 text-left transition-colors hover:bg-zinc-800 cursor-pointer text-white bg-zinc-900",
                  !compact && "flex-1",
                  compact && "min-w-[185px]"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-zinc-300" />
                  <span className="text-sm font-medium text-gray-100">
                    Where?
                  </span>
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
          {!compact && (
          <Popover
            open={openPopover === "activities"}
            onOpenChange={(open) => setOpenPopover(open ? "activities" : null)}
          >
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "pl-6 pr-4 py-3 text-left transition-colors hover:bg-zinc-800 cursor-pointer text-white bg-zinc-900",
                  colDivider,
                  !compact && "flex-1",
                  compact && "min-w-[185px]"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="h-4 w-4 text-zinc-300" />
                  <span className="text-sm font-medium text-gray-100">
                    What?
                  </span>
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
          )}

          {/* Date Section */}
          <Popover
            open={openPopover === "date"}
            onOpenChange={(open) => setOpenPopover(open ? "date" : null)}
          >
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "pl-6 pr-4 py-3 text-left transition-colors hover:bg-zinc-800 cursor-pointer text-white bg-zinc-900",
                  colDivider,
                  !compact && "flex-1",
                  compact && "min-w-[185px]"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <CalendarDays className="h-4 w-4 text-zinc-300" />
                  <span className="text-sm font-medium text-gray-100">
                    When?
                  </span>
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

          {/* Travelers Section + Search */}
          <div
            className={cn(
              "flex items-center",
              colDivider,
              !compact && "flex-1",
              compact && "min-w-[185px]"
            )}
          >
            <Popover
              open={openPopover === "travelers"}
              onOpenChange={(open) => setOpenPopover(open ? "travelers" : null)}
            >
              <PopoverTrigger asChild>
                <button className="flex-1 pl-6 pr-4 py-3 text-left transition-colors hover:bg-zinc-800 cursor-pointer text-white bg-zinc-900">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-zinc-300" />
                    <span className="text-sm font-medium text-gray-100">
                      Who?
                    </span>
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

            <div className={cn("flex items-center", compact ? "pl-5 pr-2" : "pl-6 pr-3")}>
              <Button
                onClick={handleSearch}
                className="rounded-full px-8 bg-brand-secondary hover:bg-brand-secondary/90 font-semibold shadow-md hover:shadow-lg transition-shadow"
                size="lg"
              >
                <span className="[text-box:trim-both_cap_alphabetic]">Search</span>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
