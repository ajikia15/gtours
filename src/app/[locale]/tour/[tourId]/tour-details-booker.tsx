"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ShoppingCart, ChevronDown, ChevronUp, Eye } from "lucide-react";

import TourDatePicker from "@/components/booking/tour-date-picker";
import TravelerSelection from "@/components/booking/traveler-selection";
import ActivitySelection from "@/components/booking/activity-selection";

import { useBooking } from "@/context/booking";
import { useCart } from "@/context/cart";
import { updateCartItem } from "@/data/cart";
import { Link } from "@/i18n/navigation";

import { Tour } from "@/types/Tour";

interface InitialState {
  selectedDate: Date | undefined;
  travelers: { adults: number; children: number; infants: number };
  selectedActivities: Set<string>;
  initialized: boolean;
}

export default function TourDetailsBooker({ tour }: { tour: Tour }) {
  // Hooks
  const booking = useBooking();
  const cart = useCart();
  const router = useRouter();

  // Local State
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState<Set<string>>(
    new Set()
  );

  // Refs
  const initialState = useRef<InitialState>({
    selectedDate: undefined,
    travelers: { adults: 0, children: 0, infants: 0 },
    selectedActivities: new Set(),
    initialized: false,
  });

  // Computed Values
  const existingCartItem = cart.items.find((item) => item.tourId === tour.id);
  const { selectedDate, travelers } = booking.sharedState;

  // Effects
  useEffect(() => {
    if (existingCartItem) {
      setSelectedActivities(new Set(existingCartItem.selectedActivities));
    }
  }, [existingCartItem]);

  useEffect(() => {
    if (
      !initialState.current.initialized &&
      selectedDate !== undefined &&
      travelers.adults > 0
    ) {
      initialState.current = {
        selectedDate: selectedDate,
        travelers: { ...travelers },
        selectedActivities: new Set(selectedActivities),
        initialized: true,
      };
    }
  }, [selectedDate, travelers, selectedActivities]);

  // Check if user has made changes from initial page load
  const hasUserMadeChanges = useMemo(() => {
    if (!initialState.current.initialized) return false;

    const initial = initialState.current;

    const dateChanged =
      initial.selectedDate?.getTime() !== selectedDate?.getTime();
    const travelersChanged =
      initial.travelers.adults !== travelers.adults ||
      initial.travelers.children !== travelers.children ||
      initial.travelers.infants !== travelers.infants;
    const activitiesChanged =
      initial.selectedActivities.size !== selectedActivities.size ||
      !Array.from(initial.selectedActivities).every((activity) =>
        selectedActivities.has(activity)
      );

    return dateChanged || travelersChanged || activitiesChanged;
  }, [selectedDate, travelers, selectedActivities]);

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
  const handleCartAction = async () => {
    setIsAddingToCart(true);

    try {
      if (existingCartItem && hasUserMadeChanges) {
        // Update existing cart item
        const result = await updateCartItem(existingCartItem.id, {
          selectedDate,
          travelers,
          selectedActivities: Array.from(selectedActivities),
        });

        if (result?.success !== false) {
          // Reset initial state after successful update
          initialState.current = {
            selectedDate: selectedDate,
            travelers: { ...travelers },
            selectedActivities: new Set(selectedActivities),
            initialized: true,
          };
          router.push("/cart");
        }
      } else if (!existingCartItem) {
        // Add new item to cart
        await booking.addPartialBookingToCart(
          tour,
          Array.from(selectedActivities)
        );
      }
    } catch (error) {
      console.error("Failed to handle cart action:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  // Render Functions
  const renderPricingSummary = () => (
    <div className="text-lg font-semibold text-gray-900">
      {calculateActivityPriceIncrement() > 0 && (
        <div className="text-sm text-gray-600 mb-1">
          Activities: +{calculateActivityPriceIncrement()} GEL
        </div>
      )}
      Total: <span className="text-red-500">{calculateTotalPrice()} GEL</span>
    </div>
  );

  const renderCartButton = () => {
    if (existingCartItem && hasUserMadeChanges) {
      return (
        <Button
          className="w-full"
          variant="outline"
          onClick={handleCartAction}
          disabled={isAddingToCart}
        >
          {isAddingToCart ? (
            "Updating..."
          ) : (
            <>
              <ShoppingCart className="size-4 mr-2" />
              Update in Cart
            </>
          )}
        </Button>
      );
    }

    if (existingCartItem) {
      return (
        <Link href="/account/cart">
          <Button className="w-full" variant="secondary">
            <Eye className="size-4 mr-2" />
            View in Cart
          </Button>
        </Link>
      );
    }

    return (
      <Button
        className="w-full"
        variant="outline"
        onClick={handleCartAction}
        disabled={isAddingToCart}
      >
        <ShoppingCart className="size-4 mr-2" />
        {isAddingToCart ? "Adding..." : "Add to Cart"}
      </Button>
    );
  };

  const renderBookingContent = () => (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-gray-900">Choose Date</h2>
      <TourDatePicker date={selectedDate} setDate={booking.updateSharedDate} />

      <h2 className="text-lg font-semibold text-gray-900">Travelers</h2>
      <TravelerSelection
        travelers={travelers}
        setTravelers={booking.updateSharedTravelers}
      />

      <h2 className="text-lg font-semibold text-gray-900">Select Activities</h2>
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
      <div className="h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
      <div className="bg-white pt-2">
        <Button
          onClick={toggleExpanded}
          className="w-full shadow-lg"
          variant="brandred"
        >
          <ChevronDown className="size-4 mr-2" />
          Continue Booking
        </Button>
      </div>
    </div>
  );

  const renderActionButtons = () => (
    <div className="space-y-3 mt-4">
      <Button
        onClick={toggleExpanded}
        variant="ghost"
        className="w-full text-gray-500 hover:text-gray-700"
        size="sm"
      >
        <ChevronUp className="size-4 mr-2" />
        Collapse
      </Button>

      {renderCartButton()}

      <Button className="w-full" variant="brandred" size="lg">
        Book Tour Now
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
