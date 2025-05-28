"use client";
import TourDatePicker from "@/components/booking/tour-date-picker";
import TravelerSelection from "@/components/booking/traveler-selection";
import { Button } from "@/components/ui/button";
import ActivitySelection from "@/components/booking/activity-selection";
import { ShoppingCart, ChevronDown, ChevronUp } from "lucide-react";
import { Tour } from "@/types/Tour";
import { useState } from "react";
import { useBooking } from "@/context/booking";

export default function TourDetailsBooker({ tour }: { tour: Tour }) {
  const booking = useBooking();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Use shared state for date and travelers
  const { selectedDate, travelers } = booking.sharedState;

  // Tour-specific activities
  const [selectedActivities, setSelectedActivities] = useState<Set<string>>(
    new Set()
  );

  // Calculate activity price increment using booking context
  const calculateActivityPriceIncrement = () => {
    return booking.calculateActivityPriceIncrement(
      tour,
      Array.from(selectedActivities)
    );
  };

  // Calculate total price using booking context
  const calculateTotalPrice = () => {
    return booking.calculateTotalPrice(
      tour,
      travelers,
      Array.from(selectedActivities)
    );
  };

  // Handle add to cart using booking context (allows partial bookings)
  const handleAddToCart = async () => {
    setIsAddingToCart(true);

    try {
      await booking.addPartialBookingToCart(
        tour,
        Array.from(selectedActivities)
      );

      // Success/error messages are handled by the booking context
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };
  return (
    <>
      <div className="relative">
        {/* Booking Content */}
        <div
          className={`
            flex flex-col gap-4 transition-all duration-500 ease-in-out overflow-hidden
            ${isExpanded ? "max-h-none" : "max-h-128"}
          `}
        >
          <h2 className="text-lg font-semibold text-gray-900">Choose Date</h2>
          <TourDatePicker
            date={selectedDate}
            setDate={booking.updateSharedDate}
          />
          <h2 className="text-lg font-semibold text-gray-900">Travelers</h2>
          <TravelerSelection
            travelers={travelers}
            setTravelers={booking.updateSharedTravelers}
          />
          <h2 className="text-lg font-semibold text-gray-900">
            Select Activities
          </h2>
          <ActivitySelection
            activities={tour.offeredActivities}
            selectedActivities={selectedActivities}
            setSelectedActivities={setSelectedActivities}
          />
          <div className="text-lg font-semibold text-gray-900">
            {calculateActivityPriceIncrement() > 0 && (
              <div className="text-sm text-gray-600 mb-1">
                Activities: +{calculateActivityPriceIncrement()} GEL
              </div>
            )}
            Total:{" "}
            <span className="text-red-500">{calculateTotalPrice()} GEL</span>
          </div>
        </div>

        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0">
            {/* Gradient fade */}
            <div className="h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />

            {/* Continue Booking Button */}
            <div className="bg-white pt-2">
              <Button
                onClick={() => setIsExpanded(true)}
                className="w-full  shadow-lg"
                variant="brandred"
              >
                <ChevronDown className="size-4 mr-2" />
                Continue Booking
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons (only show when expanded) */}
      {isExpanded && (
        <div className="space-y-3 mt-4">
          <Button
            onClick={() => setIsExpanded(false)}
            variant="ghost"
            className="w-full text-gray-500 hover:text-gray-700"
            size="sm"
          >
            <ChevronUp className="size-4 mr-2" />
            Collapse
          </Button>

          <Button
            className="w-full"
            variant="outline"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            <ShoppingCart className="size-4 mr-2" />
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </Button>

          <Button className="w-full" variant="brandred" size="lg">
            Book Tour Now
          </Button>
        </div>
      )}
    </>
  );
}
