"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, MapPin, Activity, CalendarDays, Users } from "lucide-react";
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
}

export default function MobileTourSearchBar({
  tours,
  onSearch,
  className = "",
}: MobileTourSearchBarProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [openAccordionItem, setOpenAccordionItem] = useState<string>("");

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

  const handleSearchAndClose = () => {
    handleSearch();
    setIsSheetOpen(false);
  };

  return (
    <div className={cn("w-full", className)}>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="w-full h-14 justify-start bg-white border-gray-300 hover:bg-gray-50"
          >
            <Search className="h-5 w-5 text-gray-400 mr-3" />
            <span className="text-left text-gray-600 flex-1 truncate">
              {getSearchSummary()}
            </span>
          </Button>
        </SheetTrigger>

        <SheetContent side="bottom" className="h-[85vh] flex flex-col">
          <SheetHeader className="pb-4">
            <SheetTitle>Search Tours</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto">
            <Accordion
              type="single"
              collapsible
              value={openAccordionItem}
              onValueChange={setOpenAccordionItem}
              className="space-y-2"
            >
              {/* Destinations Section */}
              <AccordionItem value="destinations" className="border rounded-lg">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center gap-3 w-full">
                    <MapPin className="h-5 w-5 text-gray-600" />
                    <div className="flex-1 text-left">
                      <h3 className="font-medium">Destinations</h3>
                      <p className="text-sm text-gray-600">
                        {getDestinationDisplay()}
                      </p>
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
              <AccordionItem value="activities" className="border rounded-lg">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center gap-3 w-full">
                    <Activity className="h-5 w-5 text-gray-600" />
                    <div className="flex-1 text-left">
                      <h3 className="font-medium">Activities</h3>
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

              {/* Date Section */}
              <AccordionItem value="date" className="border rounded-lg">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center gap-3 w-full">
                    <CalendarDays className="h-5 w-5 text-gray-600" />
                    <div className="flex-1 text-left">
                      <h3 className="font-medium">Date</h3>
                      <p className="text-sm text-gray-600">
                        {getDateDisplay()}
                      </p>
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
              <AccordionItem value="travelers" className="border rounded-lg">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center gap-3 w-full">
                    <Users className="h-5 w-5 text-gray-600" />
                    <div className="flex-1 text-left">
                      <h3 className="font-medium">Travelers</h3>
                      <p className="text-sm text-gray-600">
                        {getTravelersDisplay()}
                      </p>
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

          <SheetFooter className="pt-4">
            <Button
              onClick={handleSearchAndClose}
              className="w-full bg-brand-secondary hover:bg-brand-secondary/90"
              size="lg"
            >
              Search
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
