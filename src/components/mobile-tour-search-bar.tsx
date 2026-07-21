"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, MapPin, Activity, CalendarDays, Users, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import TourDatePicker from "@/components/booking/tour-date-picker";
import TravelerSelection from "@/components/booking/traveler-selection";
import { useTourSearch } from "@/hooks/use-tour-search";
import type { Tour } from "@/types/Tour";

// Import existing content components from main search bar
import {
  DestinationSelectionContent,
  ActivitySelectionContent,
} from "./tour-search-bar";

interface MobileTourSearchBarProps {
  tours: Tour[];
  onSearch?: (filters: any, results: Tour[]) => void;
  className?: string;
  compact?: boolean;
}

export default function MobileTourSearchBar({
  tours,
  onSearch,
  className = "",
  compact = false,
}: MobileTourSearchBarProps) {
  const t = useTranslations("SearchBar");
  const [isOpen, setIsOpen] = useState(false);
  const [openAccordionItem, setOpenAccordionItem] =
    useState<string>("destinations");

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
    getSearchSummary,
    getDestinationDisplay,
    getActivitiesDisplay,
    getDateDisplay,
    getTravelersDisplay,
  } = useTourSearch({ tours, onSearch });

  const open = () => {
    setOpenAccordionItem("destinations");
    setIsOpen(true);
    document
      .getElementById("hero-search-anchor")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const close = () => {
    setIsOpen(false);
  };

  const handleSearchAndClose = () => {
    handleSearch();
    close();
  };

  const hasSelection =
    getSearchSummary() !== "Search destinations, add dates, add guests";

  return (
    <div className={cn("w-full", className)}>
      <button
        type="button"
        onClick={open}
        className="flex w-full items-center gap-3 h-14 rounded-full bg-white pl-5 pr-1.5 shadow-sm"
      >
        <MapPin className="h-5 w-5 shrink-0 text-brand-secondary" />
        <span
          className={cn(
            "flex-1 truncate text-left text-[15px]",
            hasSelection ? "text-neutral-900" : "text-neutral-500"
          )}
        >
          {hasSelection ? getSearchSummary() : t("whereHeaded")}
        </span>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-secondary text-white">
          <Search className="h-5 w-5" />
        </span>
      </button>

      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[60] flex flex-col bg-[#F5F5F7] animate-in slide-in-from-bottom duration-500 ease-out">
          <div className="shrink-0 px-5 pt-3">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-neutral-300" />
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-900">Search Tours</h2>
              <button
                type="button"
                onClick={close}
                className="grid h-9 w-9 place-items-center rounded-full bg-white text-neutral-700 shadow-sm"
                aria-label="Close search"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pb-4">
            <Accordion
        type="single"
        collapsible
        value={openAccordionItem}
        onValueChange={setOpenAccordionItem}
        className="space-y-2"
      >
        {/* Destinations Section */}
        <AccordionItem value="destinations" className="border rounded-lg bg-white">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-3 w-full">
              <MapPin className="h-5 w-5 text-gray-600" />
              <div className="flex-1 text-left">
                <h3 className="font-medium">Where?</h3>
                <p className="text-sm text-gray-600">{getDestinationDisplay()}</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <DestinationSelectionContent
              destinations={allDestinations}
              selectedDestinations={filters.destinations}
              onDestinationToggle={handleDestinationToggle}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Activities Section */}
        {!compact && (
          <AccordionItem value="activities" className="border rounded-lg bg-white">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3 w-full">
                <Activity className="h-5 w-5 text-gray-600" />
                <div className="flex-1 text-left">
                  <h3 className="font-medium">What?</h3>
                  <p className="text-sm text-gray-600">
                    {getActivitiesDisplay()}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <ActivitySelectionContent
                activities={allActivities}
                selectedActivities={filters.activities}
                onActivityToggle={handleActivityToggle}
              />
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Date Section */}
        <AccordionItem value="date" className="border rounded-lg bg-white">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-3 w-full">
              <CalendarDays className="h-5 w-5 text-gray-600" />
              <div className="flex-1 text-left">
                <h3 className="font-medium">When?</h3>
                <p className="text-sm text-gray-600">{getDateDisplay()}</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="flex justify-center">
              <TourDatePicker
                date={filters.selectedDate}
                setDate={handleDateChange}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Travelers Section */}
        <AccordionItem value="travelers" className="border rounded-lg bg-white">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-3 w-full">
              <Users className="h-5 w-5 text-gray-600" />
              <div className="flex-1 text-left">
                <h3 className="font-medium">Who?</h3>
                <p className="text-sm text-gray-600">{getTravelersDisplay()}</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <TravelerSelection
              travelers={filters.travelers}
              setTravelers={handleTravelersChange}
            />
          </AccordionContent>
        </AccordionItem>
            </Accordion>
          </div>

          <div className="shrink-0 px-5 pb-8 pt-3">
            <Button
              onClick={handleSearchAndClose}
              className="w-full bg-brand-secondary hover:bg-brand-secondary/90"
              size="lg"
            >
              Search
            </Button>
          </div>
        </div>,
          document.body
        )}
    </div>
  );
}
