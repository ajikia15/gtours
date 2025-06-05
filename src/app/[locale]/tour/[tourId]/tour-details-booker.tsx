"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";

import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Album } from "lucide-react";

import TourDatePicker from "@/components/booking/tour-date-picker";
import TravelerSelection from "@/components/booking/traveler-selection";
import ActivitySelection from "@/components/booking/activity-selection";
import AddToCartButton from "@/components/add-to-cart-button";

import { useBooking } from "@/context/booking";
import { useCart } from "@/context/cart";
import { useCartChanges } from "@/hooks/use-cart-changes";

import { Tour } from "@/types/Tour";

export default function TourDetailsBooker({ tour }: { tour: Tour }) {
  // Hooks
  const booking = useBooking();
  const cart = useCart();
  const router = useRouter();

  // Local State
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState<Set<string>>(
    new Set()
  );
  const [isBookingNow, setIsBookingNow] = useState(false);

  // Computed Values
  const existingCartItem = cart.items.find((item) => item.tourId === tour.id);
  const { selectedDate, travelers } = booking.sharedState;

  // Change detection hook
  const { initialState, resetInitialState } = useCartChanges({
    selectedDate,
    travelers,
    selectedActivities: Array.from(selectedActivities),
  });

  // Effects
  useEffect(() => {
    if (existingCartItem) {
      setSelectedActivities(new Set(existingCartItem.selectedActivities));
    }
  }, [existingCartItem]);

  // Calculation Functions
  const calculateActivityPriceIncrement = () => {
    return booking.calculateActivityPriceIncrement(
      tour,
      Array.from(selectedActivities)
    );
  };

  const calculateTotalPrice = () => {
    return booking.calculateTotalPrice(
      tour,
      travelers,
      Array.from(selectedActivities)
    );
  };
  // Event Handlers
  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const handleBookTourNow = async () => {
    setIsBookingNow(true);
    try {
      const result = await booking.proceedToDirectCheckout(
        tour,
        Array.from(selectedActivities)
      );

      if (result.success && result.checkoutUrl) {
        router.push(result.checkoutUrl);
      }
    } catch (error) {
      console.error("Error in Book Tour Now:", error);
    } finally {
      setIsBookingNow(false);
    }
  };

  // Render Functions
  const renderPricingSummary = () => (
    <div className="text-lg font-semibold text-gray-900">
      Total: <span className="text-red-500">{calculateTotalPrice()} GEL</span>
    </div>
  );

  const renderBookingContent = () => (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-gray-900">Choose Date</h2>
      <TourDatePicker date={selectedDate} setDate={booking.updateSharedDate} />

      <h2 className="text-lg font-semibold text-gray-900">Travelers</h2>
      <TravelerSelection
        travelers={travelers}
        setTravelers={booking.updateSharedTravelers}
      />
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">
          Select Activities
        </h2>
        {calculateActivityPriceIncrement() > 0 && (
          <p className="text-xs text-gray-600">
            +{calculateActivityPriceIncrement()} GEL
          </p>
        )}
      </div>
      <ActivitySelection
        activities={tour.offeredActivities}
        selectedActivities={selectedActivities}
        setSelectedActivities={setSelectedActivities}
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
      <Button
        className="w-full"
        variant="brandred"
        size="lg"
        onClick={handleBookTourNow}
        disabled={isBookingNow}
      >
        <Album className="size-4 " />
        {isBookingNow ? "Processing..." : "Book Tour Now"}
      </Button>
      <AddToCartButton
        tour={tour}
        selectedActivities={Array.from(selectedActivities)}
        className="w-full"
        variant="outline"
        detectChanges={true}
        initialState={initialState}
        onUpdateSuccess={resetInitialState}
      />
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
    </div>
  );

  return (
    <>
      {/* Main Booking Section */}
      <div className="relative">
        <div
          className={`
            transition-all duration-500 ease-in-out overflow-hidden
            ${isExpanded ? "max-h-none" : "max-h-128"}
          `}
        >
          {renderBookingContent()}
        </div>

        {!isExpanded && renderCollapsedOverlay()}
      </div>

      {/* Action Buttons */}
      {isExpanded && renderActionButtons()}
    </>
  );
}
