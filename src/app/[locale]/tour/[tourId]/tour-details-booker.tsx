"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

import TourDatePicker from "@/components/booking/tour-date-picker";
import TravelerSelection from "@/components/booking/traveler-selection";
import ActivitySelection from "@/components/booking/activity-selection";
import TourActionButton from "@/components/tour-action-button";

import { useTourBooking } from "@/hooks/use-tour-booking";
import { useCartChanges } from "@/hooks/use-cart-changes";

import { Tour } from "@/types/Tour";

export default function TourDetailsBooker({
  tour,
  collapseAble = true,
}: {
  tour: Tour;
  collapseAble?: boolean;
}) {
  // Local State
  const [isExpanded, setIsExpanded] = useState(!collapseAble);

  // Use shared booking logic hook
  const {
    selectedDate,
    travelers,
    selectedActivities,
    totalPrice,
    activityCost,
    handleDateChange,
    handleTravelersChange,
    handleActivitiesChange,
  } = useTourBooking({ tour });

  // Change detection hook (for update detection)
  const { initialState, resetInitialState } = useCartChanges({
    selectedDate,
    travelers,
    selectedActivities,
  });

  // Event Handlers
  const toggleExpanded = () => setIsExpanded(!isExpanded);

  // Render Functions
  const renderPricingSummary = () => (
    <div className="text-lg font-semibold text-gray-900">
      Total: <span className="text-red-500">{totalPrice} GEL</span>
    </div>
  );

  const renderBookingContent = () => (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-gray-900">Choose Date</h2>
      <TourDatePicker date={selectedDate} setDate={handleDateChange} />

      <h2 className="text-lg font-semibold text-gray-900">Travelers</h2>
      <TravelerSelection
        travelers={travelers}
        setTravelers={handleTravelersChange}
      />
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">
          Select Activities
        </h2>
        {activityCost > 0 && (
          <p className="text-xs text-gray-600">
            +{activityCost} GEL
          </p>
        )}
      </div>
      <ActivitySelection
        activities={tour.offeredActivities}
        selectedActivities={new Set(selectedActivities)}
        setSelectedActivities={(activitySet) => 
          handleActivitiesChange(Array.from(activitySet))
        }
      />

      {renderPricingSummary()}
    </div>
  );

  const renderCollapsedOverlay = () => (
    <div className="absolute bottom-0 left-0 right-0">
      <div className="h-24 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
      <div className="bg-white ">
        <Button
          onClick={toggleExpanded}
          className="w-full shadow-lg"
          variant="brandred"
        >
          <ChevronDown className="size-4" />
          Continue Booking
        </Button>
      </div>
    </div>
  );
  const renderActionButtons = () => (
    <div className="space-y-3 ">
      <TourActionButton
        tour={tour}
        selectedActivities={Array.from(selectedActivities)}
        intent="primary"
        variant="brandred"
        size="lg"
        className="w-full"
      />
      <TourActionButton
        tour={tour}
        selectedActivities={Array.from(selectedActivities)}
        intent="secondary"
        className="w-full"
        variant="outline"
        detectChanges={true}
        initialState={initialState}
        onUpdateSuccess={resetInitialState}
      />
      {collapseAble && (
        <Button
          onClick={toggleExpanded}
          variant="ghost"
          className="w-full text-gray-500 hover:text-gray-700"
          size="sm"
        >
          <ChevronUp className="size-4" />
          {/* TODO maybe remove */}
          Collapse
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Main Booking Section */}
      <div className="relative">
        {" "}
        <div
          className={`
            transition-all duration-500 ease-in-out overflow-hidden
            ${isExpanded || !collapseAble ? "max-h-none" : "max-h-128"}
          `}
        >
          {renderBookingContent()}
        </div>
        {!isExpanded && collapseAble && renderCollapsedOverlay()}
      </div>{" "}
      {/* Action Buttons */}
      {(isExpanded || !collapseAble) && renderActionButtons()}
    </>
  );
}
