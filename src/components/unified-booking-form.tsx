"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useBooking } from "@/context/booking";
import { useCart } from "@/context/cart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tour } from "@/types/Tour";
import { CartItem } from "@/types/Cart";
import { toast } from "sonner";
import { updateCartItem } from "@/data/cart";

// Import booking components
import TourDatePicker from "@/components/booking/tour-date-picker";
import TravelerSelection from "@/components/booking/traveler-selection";
import ActivitySelection from "@/components/booking/activity-selection";

interface UnifiedBookingFormProps {
  tour: Tour;
  mode: "direct" | "cart-edit";
  cartItem?: CartItem;
  onSuccess?: (
    action: "added-to-cart" | "proceed-to-checkout" | "updated"
  ) => void;
  className?: string;
}

export default function UnifiedBookingForm({
  tour,
  mode,
  cartItem,
  onSuccess,
  className = "",
}: UnifiedBookingFormProps) {
  const router = useRouter();
  const booking = useBooking();
  const cart = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  // Use shared state only if cart has multiple items (for synchronization)
  const useSharedState = cart.items.length > 1;

  // State management - simplified approach
  const [localState, setLocalState] = useState(() => {
    if (mode === "cart-edit" && cartItem) {
      return {
        selectedDate: cartItem.selectedDate,
        travelers: cartItem.travelers,
        selectedActivities: cartItem.selectedActivities,
      };
    }

    // For direct booking, start with shared state if available
    return {
      selectedDate: booking.sharedState.selectedDate,
      travelers:
        booking.sharedState.travelers.adults > 0
          ? booking.sharedState.travelers
          : { adults: 2, children: 0, infants: 0 },
      selectedActivities: [],
    };
  });

  // Current state - use shared state for cart editing with multiple items
  const currentState =
    mode === "cart-edit" && useSharedState
      ? {
          selectedDate: booking.sharedState.selectedDate,
          travelers: booking.sharedState.travelers,
          selectedActivities: localState.selectedActivities, // Activities remain tour-specific
        }
      : localState;

  // Update handlers
  const handleDateChange = (date: Date | undefined) => {
    if (useSharedState) {
      booking.updateSharedDate(date);
    } else {
      setLocalState((prev) => ({ ...prev, selectedDate: date }));
    }
  };

  const handleTravelersChange = (travelers: typeof currentState.travelers) => {
    if (useSharedState) {
      booking.updateSharedTravelers(travelers);
    } else {
      setLocalState((prev) => ({ ...prev, travelers }));
    }
  };

  const handleActivitiesChange = (activities: string[]) => {
    setLocalState((prev) => ({ ...prev, selectedActivities: activities }));
  };

  // Validation
  const validation = booking.validateBooking({
    selectedDate: currentState.selectedDate,
    travelers: currentState.travelers,
    selectedActivities: currentState.selectedActivities,
  });

  const isComplete = validation.isComplete;

  // Calculate pricing
  const totalPrice = booking.calculateTotalPrice(
    tour,
    currentState.travelers,
    currentState.selectedActivities
  );

  const handleSubmit = async () => {
    if (!isComplete) {
      toast.error("Please complete all required fields");
      return;
    }

    setIsProcessing(true);

    try {
      if (mode === "direct") {
        // Direct booking - proceed to checkout
        const result = await booking.proceedToDirectCheckoutWithDetails(tour, {
          selectedDate: currentState.selectedDate!,
          travelers: currentState.travelers,
          selectedActivities: currentState.selectedActivities,
        });

        if (result.success && result.checkoutUrl) {
          router.push(result.checkoutUrl);
          onSuccess?.("proceed-to-checkout");
        } else {
          toast.error(result.message || "Failed to proceed to checkout");
        }
      } else {
        // Cart edit mode
        if (!cartItem) {
          toast.error("Cart item not found");
          return;
        }

        if (useSharedState) {
          // Update all cart items with shared state + individual activities
          await updateCartItem(cartItem.id, {
            selectedActivities: currentState.selectedActivities,
          });

          // Update all other cart items with shared date/travelers
          const updatePromises = cart.items
            .filter((item) => item.id !== cartItem.id)
            .map((item) =>
              updateCartItem(item.id, {
                selectedDate: currentState.selectedDate,
                travelers: currentState.travelers,
              })
            );

          await Promise.all(updatePromises);
          toast.success("All bookings updated successfully!");
        } else {
          // Update only this cart item
          await updateCartItem(cartItem.id, {
            selectedDate: currentState.selectedDate,
            travelers: currentState.travelers,
            selectedActivities: currentState.selectedActivities,
          });
          toast.success("Booking updated successfully!");
        }

        onSuccess?.("updated");
      }
    } catch (error) {
      console.error("Submit failed:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className={`p-6 space-y-6 ${className}`}>
      {/* Tour Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant={mode === "direct" ? "default" : "secondary"}>
            {mode === "direct" ? "Direct Booking" : "Editing"}
          </Badge>
          <div>
            <h3 className="font-semibold">{tour.title[0]}</h3>
            <p className="text-sm text-gray-600">
              Base price: {tour.basePrice} GEL per person
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-red-600">
            Total: {totalPrice} GEL
          </p>
        </div>
      </div>

      {/* Shared State Indicator */}
      {useSharedState && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Date and traveler changes will update all
            tours in your cart. Activity selections are specific to this tour
            only.
          </p>
        </div>
      )}

      {/* Date Selection */}
      <div className="space-y-3">
        <h4 className="font-medium">Select Date</h4>
        <TourDatePicker
          date={currentState.selectedDate}
          setDate={handleDateChange}
        />
      </div>

      {/* Traveler Selection */}
      <div className="space-y-3">
        <h4 className="font-medium">Select Travelers</h4>
        <TravelerSelection
          travelers={currentState.travelers}
          setTravelers={handleTravelersChange}
        />
      </div>

      {/* Activity Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Select Activities</h4>
          {currentState.selectedActivities.length > 0 && (
            <p className="text-sm text-gray-600">
              +
              {booking.calculateActivityPriceIncrement(
                tour,
                currentState.selectedActivities
              )}
              GEL
            </p>
          )}
        </div>
        <ActivitySelection
          activities={tour.offeredActivities || []}
          selectedActivities={new Set(currentState.selectedActivities)}
          setSelectedActivities={(activities) =>
            handleActivitiesChange(Array.from(activities))
          }
          onSelectionChange={handleActivitiesChange}
          disableTooltips={true}
        />
      </div>

      {/* Validation Errors */}
      {!validation.isComplete && validation.errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h5 className="font-medium text-red-900 mb-2">Please complete:</h5>
          <ul className="text-sm text-red-800 space-y-1">
            {validation.errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        className="w-full"
        disabled={!isComplete || isProcessing}
        size="lg"
      >
        {isProcessing
          ? "Processing..."
          : mode === "direct"
          ? "Book Now"
          : "Update Booking"}
      </Button>
    </Card>
  );
}
