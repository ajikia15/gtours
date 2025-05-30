"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "@/context/booking";
import { useCart } from "@/context/cart";
import { updateCartItem } from "@/data/cart";
import { Tour } from "@/types/Tour";
import { CartItem } from "@/types/Cart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  Edit3,
  ShoppingCart,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import TourDatePicker from "@/components/booking/tour-date-picker";
import TravelerSelection from "@/components/booking/traveler-selection";
import ActivitySelection from "@/components/booking/activity-selection";

interface BookingBarProps {
  tours: Tour[];
  mode?: "add" | "edit";
  editingItem?: CartItem;
  preselectedTour?: Tour;
  onSuccess?: () => void;
  className?: string;
}

export default function BookingBar({
  tours,
  mode = "add",
  editingItem,
  preselectedTour,
  onSuccess,
  className = "",
}: BookingBarProps) {
  const router = useRouter();
  const booking = useBooking();
  const cart = useCart();

  // Use shared state only in edit mode
  const { selectedDate: sharedDate, travelers: sharedTravelers } =
    booking.sharedState;

  // Local state for both modes
  const [selectedTour, setSelectedTour] = useState<Tour | null>(() => {
    if (mode === "edit" && editingItem) {
      return tours.find((t) => t.id === editingItem.tourId) || null;
    }
    return preselectedTour || null;
  });

  const [selectedActivities, setSelectedActivities] = useState<string[]>(() => {
    if (mode === "edit" && editingItem) {
      return editingItem.selectedActivities;
    }
    return [];
  });

  // Local state - always used, no shared state in edit mode for individual items
  const [localDate, setLocalDate] = useState<Date | undefined>(() => {
    if (mode === "edit" && editingItem) {
      return editingItem.selectedDate;
    }
    return undefined;
  });

  const [localTravelers, setLocalTravelers] = useState(() => {
    if (mode === "edit" && editingItem) {
      return editingItem.travelers;
    }
    return { adults: 2, children: 0, infants: 0 };
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // Always use local state for individual item editing
  const selectedDate = localDate;
  const travelers = localTravelers;

  // Simple derived state
  const totalPrice = selectedTour
    ? booking.calculateTotalPrice(selectedTour, travelers, selectedActivities)
    : 0;

  const validation = booking.validateBooking({
    selectedDate,
    travelers,
    selectedActivities,
  });

  const isComplete = validation.isComplete && selectedTour;

  // Handlers
  const handleTourSelect = (tour: Tour) => {
    setSelectedTour(tour);
    setSelectedActivities([]); // Reset activities when tour changes
  };

  const handleDateChange = (date: Date | undefined) => {
    setLocalDate(date);
  };

  const handleTravelersChange = (newTravelers: typeof travelers) => {
    setLocalTravelers(newTravelers);
  };

  const handleSubmit = async () => {
    if (!selectedTour || !isComplete) {
      toast.error("Please complete all required fields");
      return;
    }

    setIsProcessing(true);

    try {
      if (mode === "edit" && editingItem) {
        // Edit mode: update cart item with current local state values
        const result = await updateCartItem(editingItem.id, {
          selectedDate: selectedDate!,
          travelers: travelers,
          selectedActivities,
          totalPrice,
        });

        if (result.success) {
          toast.success("Booking updated successfully!");
          // Always go back to cart in edit mode
          router.push("/account/cart");
          onSuccess?.();
        } else {
          toast.error(result.message || "Failed to update booking");
          return;
        }
      } else {
        // Add mode: add directly to cart without shared state
        const { addToCart } = await import("@/data/cart");

        const result = await addToCart({
          tourId: selectedTour.id,
          tourTitle: selectedTour.title,
          tourBasePrice: selectedTour.basePrice,
          tourImages: selectedTour.images,
          selectedDate: selectedDate!,
          travelers: travelers,
          selectedActivities: selectedActivities,
        });

        if (result.success) {
          toast.success("Added to cart successfully!");

          // Navigate based on cart state
          if (cart.items.length > 0) {
            // Already have items, go to cart
            router.push("/account/cart");
          } else {
            // No existing items, go directly to checkout
            // TODO: redirect to checkout when implemented
            router.push("/account/cart"); // For now, go to cart
          }

          onSuccess?.();
        } else {
          toast.error(result.message || "Failed to add to cart");
          return;
        }
      }
    } catch (error) {
      console.error("Booking operation failed:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Section content helpers
  const getTourDisplay = () => {
    if (!selectedTour) return "Select tour";
    return selectedTour.title;
  };

  const getActivitiesDisplay = () => {
    if (!selectedTour) return "Select tour first";
    if (selectedActivities.length === 0) return "Select activities";
    return `${selectedActivities.length} activit${
      selectedActivities.length !== 1 ? "ies" : "y"
    }`;
  };

  const getDateDisplay = () => {
    if (!selectedDate) return "Select date";
    return selectedDate.toLocaleDateString();
  };

  const getTravelersDisplay = () => {
    const total = booking.getTotalPeople(travelers);
    if (total === 0) return "Select travelers";
    return `${total} traveler${total !== 1 ? "s" : ""}`;
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            {mode === "edit" ? (
              <>
                <Edit3 className="h-5 w-5" />
                Edit Booking
              </>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5" />
                Create Booking
              </>
            )}
          </h2>
          {mode === "edit" && (
            <Badge variant="secondary">Editing: {editingItem?.tourTitle}</Badge>
          )}
        </div>
      </div>

      {/* Search Bar Style Main Bar */}
      <div className="flex divide-x">
        {/* Tour Section */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              disabled={mode === "edit" || !!preselectedTour}
              className={cn(
                "flex-1 p-4 text-left transition-colors hover:bg-gray-50 cursor-pointer",
                (mode === "edit" || !!preselectedTour) &&
                  "opacity-50 cursor-not-allowed",
                !selectedTour && "text-gray-500"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="h-4 w-4" />
                <span className="text-xs font-medium text-gray-600">Tour</span>
              </div>
              <div className="text-sm font-medium truncate">
                {getTourDisplay()}
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-3">
              <h4 className="font-medium">Select Tour</h4>
              <TourSelectionContent
                tours={tours}
                selectedTour={selectedTour}
                onTourSelect={handleTourSelect}
              />
            </div>
          </PopoverContent>
        </Popover>

        {/* Activities Section */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              disabled={!selectedTour}
              className={cn(
                "flex-1 p-4 text-left transition-colors hover:bg-gray-50 cursor-pointer",
                !selectedTour && "opacity-50 cursor-not-allowed",
                selectedActivities.length === 0 && "text-gray-500"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <Activity className="h-4 w-4" />
                <span className="text-xs font-medium text-gray-600">
                  Activities
                </span>
              </div>
              <div className="text-sm font-medium truncate">
                {getActivitiesDisplay()}
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-3">
              <h4 className="font-medium">Select Activities</h4>
              {selectedTour ? (
                <ActivitySelection
                  activities={selectedTour.offeredActivities || []}
                  selectedActivities={new Set(selectedActivities)}
                  setSelectedActivities={(activities) =>
                    setSelectedActivities(Array.from(activities))
                  }
                  onSelectionChange={setSelectedActivities}
                  disableTooltips={true}
                />
              ) : (
                <p className="text-sm text-gray-500">
                  Please select a tour first
                </p>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Date Section */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "flex-1 p-4 text-left transition-colors hover:bg-gray-50 cursor-pointer",
                !selectedDate && "text-gray-500"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <CalendarDays className="h-4 w-4" />
                <span className="text-xs font-medium text-gray-600">Date</span>
              </div>
              <div className="text-sm font-medium truncate">
                {getDateDisplay()}
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <TourDatePicker date={selectedDate} setDate={handleDateChange} />
          </PopoverContent>
        </Popover>

        {/* Travelers Section */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "flex-1 p-4 text-left transition-colors hover:bg-gray-50 cursor-pointer",
                booking.getTotalPeople(travelers) === 0 && "text-gray-500"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4" />
                <span className="text-xs font-medium text-gray-600">
                  Travelers
                </span>
              </div>
              <div className="text-sm font-medium truncate">
                {getTravelersDisplay()}
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-3">
              <h4 className="font-medium">Select Travelers</h4>
              <TravelerSelection
                travelers={travelers}
                setTravelers={handleTravelersChange}
              />
            </div>
          </PopoverContent>
        </Popover>

        {/* Submit Section */}
        <div className="flex-shrink-0">
          <Button
            onClick={handleSubmit}
            disabled={!isComplete || isProcessing}
            className="h-full rounded-none px-6"
            size="lg"
          >
            {isProcessing
              ? "Processing..."
              : mode === "edit"
              ? "Update"
              : "Book Now"}
          </Button>
        </div>
      </div>

      {/* Pricing Summary */}
      {selectedTour && (
        <div className="p-4 border-t bg-gray-50">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Price:</span>
            <span className="text-lg font-bold text-primary">
              {totalPrice} GEL
            </span>
          </div>
        </div>
      )}

      {/* Validation Errors */}
      {!validation.isComplete && validation.errors.length > 0 && (
        <div className="p-4 border-t bg-red-50">
          <div className="text-sm text-red-700 space-y-1">
            {validation.errors.map((error, index) => (
              <div key={index}>• {error}</div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

// Tour Selection Content Component
interface TourSelectionContentProps {
  tours: Tour[];
  selectedTour: Tour | null;
  onTourSelect: (tour: Tour) => void;
}

function TourSelectionContent({
  tours,
  selectedTour,
  onTourSelect,
}: TourSelectionContentProps) {
  return (
    <div className="space-y-2 max-h-60 overflow-y-auto">
      {tours.map((tour) => (
        <button
          key={tour.id}
          onClick={() => onTourSelect(tour)}
          className={cn(
            "w-full p-3 text-left rounded-lg border transition-colors",
            selectedTour?.id === tour.id
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-300"
          )}
        >
          <div className="font-medium">{tour.title}</div>
          <div className="text-sm text-gray-500">
            {tour.basePrice} GEL • {tour.duration} days
          </div>
        </button>
      ))}
    </div>
  );
}
