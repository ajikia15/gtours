/**
 * Custom hook for tour search functionality
 * Extracted from tour-search-bar for reusability across desktop and mobile components
 */

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { Tour } from "@/types/Tour";
import { getLocalizedTitle } from "@/lib/localizationHelpers";

export interface SearchFilters {
  destinations: string[];
  activities: string[];
  selectedDate?: Date;
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

interface UseTourSearchOptions {
  tours: Tour[];
  onSearch?: (filters: SearchFilters, results: Tour[]) => void;
}

export function useTourSearch({ tours, onSearch }: UseTourSearchOptions) {
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

  const [filters, setFilters] = useState<SearchFilters>(getInitialFilters);

  // Update filters when URL changes
  useEffect(() => {
    setFilters(getInitialFilters());
  }, [getInitialFilters]);

  // Get all unique destinations from tour titles
  const allDestinations = Array.from(
    new Set(
      tours.map((tour) => {
        const title = getLocalizedTitle(tour, locale);
        return title.split(" - ")[0] || title;
      })
    )
  ).sort();

  // Get all unique activities from tours, filtered by selected destinations
  const getAvailableActivities = useCallback(() => {
    let relevantTours = tours;

    if (filters.destinations.length > 0) {
      relevantTours = tours.filter((tour) => {
        const localizedTitle = getLocalizedTitle(tour, locale);
        return filters.destinations.some((destination) =>
          localizedTitle.toLowerCase().includes(destination.toLowerCase())
        );
      });
    }

    return Array.from(
      relevantTours.reduce((acc, tour) => {
        tour.offeredActivities?.forEach((activity) => {
          acc.set(activity.activityTypeId, activity.nameSnapshot);
        });
        return acc;
      }, new Map<string, string>())
    );
  }, [tours, filters.destinations, locale]);

  // Filter and search tours
  const filteredTours = tours.filter((tour) => {
    const localizedTitle = getLocalizedTitle(tour, locale);

    const matchesDestination =
      filters.destinations.length === 0 ||
      filters.destinations.some((destination) =>
        localizedTitle.toLowerCase().includes(destination.toLowerCase())
      );

    const matchesActivities =
      filters.activities.length === 0 ||
      filters.activities.some((activityId) =>
        tour.offeredActivities?.some(
          (offered) => offered.activityTypeId === activityId
        )
      );

    return matchesDestination && matchesActivities;
  });

  // Handlers
  const handleDestinationToggle = (destination: string) => {
    setFilters((prev) => ({
      ...prev,
      destinations: prev.destinations.includes(destination)
        ? prev.destinations.filter((d) => d !== destination)
        : [...prev.destinations, destination],
    }));
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
    const searchParams = new URLSearchParams();

    if (filters.destinations.length > 0) {
      searchParams.set("destinations", filters.destinations.join(","));
    }

    if (filters.activities.length > 0) {
      searchParams.set("activities", filters.activities.join(","));
    }

    if (filters.selectedDate) {
      searchParams.set("date", filters.selectedDate.toISOString());
    }

    const { adults, children, infants } = filters.travelers;
    if (adults !== 2 || children > 0 || infants > 0) {
      searchParams.set("adults", adults.toString());
      if (children > 0) searchParams.set("children", children.toString());
      if (infants > 0) searchParams.set("infants", infants.toString());
    }

    const searchString = searchParams.toString();
    const destinationUrl = searchString
      ? `/destinations?${searchString}`
      : "/destinations";

    router.push(destinationUrl);
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
      return "Pre-fill travelers";
    }
    return `${total} traveler${total !== 1 ? "s" : ""}`;
  };

  const getSearchSummary = () => {
    const parts = [];
    if (filters.destinations.length > 0) parts.push(getDestinationDisplay());
    if (filters.activities.length > 0) parts.push(getActivitiesDisplay());
    if (filters.selectedDate) parts.push(getDateDisplay());
    if (getTravelersDisplay() !== "Pre-fill travelers") parts.push(getTravelersDisplay());
    
    return parts.length > 0 ? parts.join(" • ") : "Search destinations, activities...";
  };

  return {
    // State
    filters,
    filteredTours,
    allDestinations,
    allActivities: getAvailableActivities(),

    // Handlers
    handleDestinationToggle,
    handleActivityToggle,
    handleDateChange,
    handleTravelersChange,
    handleSearch,
    clearFilter,

    // Display helpers
    getDestinationDisplay,
    getActivitiesDisplay,
    getDateDisplay,
    getTravelersDisplay,
    getSearchSummary,
  };
}
