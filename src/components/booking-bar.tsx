"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useBooking } from "@/context/booking";
import { useCart } from "@/context/cart";
import { updateCartItem } from "@/data/cart";
import { Tour } from "@/types/Tour";
import { CartItem } from "@/types/Cart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  ChevronDown,
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

  // Use shared state only in edit mode (like tour-details-booker)
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

  // Local state for add mode only
  const [localDate, setLocalDate] = useState<Date | undefined>(() => {
    if (mode === "add") {
      return undefined;
    }
    return editingItem?.selectedDate;
  });

  const [localTravelers, setLocalTravelers] = useState(() => {
    if (mode === "add") {
      return { adults: 2, children: 0, infants: 0 };
    }
    return editingItem?.travelers || { adults: 2, children: 0, infants: 0 };
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // Popover state management
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const [tourOpenedFromActivities, setTourOpenedFromActivities] =
    useState(false);

  const selectedDate = mode === "edit" ? sharedDate : localDate;
  const travelers = mode === "edit" ? sharedTravelers : localTravelers;

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
    if (mode === "edit") {
      booking.updateSharedDate(date);
    } else {
      setLocalDate(date);
    }
  };

  const handleTravelersChange = (newTravelers: typeof travelers) => {
    if (mode === "edit") {
      booking.updateSharedTravelers(newTravelers);
    } else {
      setLocalTravelers(newTravelers);
    }
  };

  const handleSubmit = async () => {
    if (!selectedTour || !isComplete) {
      toast.error("Please complete all required fields");
      return;
    }

    setIsProcessing(true);

    try {
      if (mode === "edit" && editingItem) {
        // Edit mode: update ALL cart items with shared state + individual activities

        // First update this specific item's activities
        await updateCartItem(editingItem.id, {
          selectedActivities,
        });

        // Then sync ALL cart items with current shared state
        const updatePromises = cart.items.map((item) =>
          updateCartItem(item.id, {
            selectedDate,
            travelers,
          })
        );

        await Promise.all(updatePromises);

        toast.success("All bookings updated successfully!");
        router.push("/account/cart");
        onSuccess?.();
      } else {
        // Add mode: add directly to cart without shared state
        const { addToCart } = await import("@/data/cart");

        const result = await addToCart({
          tourId: selectedTour.id,
          tourTitle: selectedTour.title,
          tourBasePrice: selectedTour.basePrice,
          tourImages: selectedTour.images,
          selectedDate: selectedDate!,
          travelers,
          selectedActivities,
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
    if (!selectedTour) return "Select activities";
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
    <Card
      className={cn(
        "overflow-hidden rounded-sm border-0 py-0 bg-zinc-900",
        className
      )}
    >
      <div className="flex divide-x divide-zinc-700">
        <Popover
          open={openPopover === "tour"}
          onOpenChange={(open) => {
            setOpenPopover(open ? "tour" : null);
            if (!open) {
              setTourOpenedFromActivities(false);
            }
          }}
        >
          <PopoverTrigger asChild>
            <button
              disabled={mode === "edit" || !!preselectedTour}
              className={cn(
                "flex-1 pl-6 pr-4 py-3 text-left transition-colors hover:bg-zinc-800 cursor-pointer text-white bg-zinc-900",
                (mode === "edit" || !!preselectedTour) &&
                  "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="h-4 w-4 text-zinc-300" />
                <span className="text-sm font-medium text-gray-100">Tour</span>
                <ChevronDown className="h-4 w-4 text-zinc-300 ml-auto" />
              </div>
              <div className="text-xs truncate text-gray-300">
                {getTourDisplay()}
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-3">
              {tourOpenedFromActivities && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Select a tour first</strong> to choose activities
                    for your trip.
                  </p>
                </div>
              )}
              <h4 className="font-medium">Select Tour</h4>
              <TourSelectionContent
                tours={tours}
                selectedTour={selectedTour}
                onTourSelect={(tour) => {
                  handleTourSelect(tour);
                  setTourOpenedFromActivities(false);
                  setOpenPopover(null);
                }}
              />
            </div>
          </PopoverContent>
        </Popover>

        {/* Activities Section */}
        <Popover
          open={openPopover === "activities"}
          onOpenChange={(open) => {
            if (open && !selectedTour) {
              // Redirect to tour selection if no tour is selected
              setTourOpenedFromActivities(true);
              setOpenPopover("tour");
            } else {
              setOpenPopover(open ? "activities" : null);
            }
          }}
        >
          <PopoverTrigger asChild>
            <button
              className={cn(
                "flex-1 pl-6 pr-4 py-3 text-left transition-colors hover:bg-zinc-800 cursor-pointer text-white bg-zinc-900"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <Activity className="h-4 w-4 text-zinc-300" />
                <span className="text-sm font-medium text-gray-100">
                  Activities
                </span>
                <ChevronDown className="h-4 w-4 text-zinc-300 ml-auto" />
              </div>
              <div className="text-xs truncate text-gray-300">
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
        <Popover
          open={openPopover === "date"}
          onOpenChange={(open) => setOpenPopover(open ? "date" : null)}
        >
          <PopoverTrigger asChild>
            <button
              className={cn(
                "flex-1 pl-6 pr-4 py-3 text-left transition-colors hover:bg-zinc-800 cursor-pointer rounded-none text-white bg-zinc-900"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <CalendarDays className="h-4 w-4 text-zinc-300" />
                <span className="text-sm font-medium text-gray-100">Date</span>
                <ChevronDown className="h-4 w-4 text-zinc-300 ml-auto" />
              </div>
              <div className="text-xs truncate text-gray-300">
                {getDateDisplay()}
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <TourDatePicker date={selectedDate} setDate={handleDateChange} />
          </PopoverContent>
        </Popover>

        {/* Travelers Section */}
        <Popover
          open={openPopover === "travelers"}
          onOpenChange={(open) => setOpenPopover(open ? "travelers" : null)}
        >
          <PopoverTrigger asChild>
            <button
              className={cn(
                "flex-1 pl-6 pr-4 py-3 text-left transition-colors hover:bg-zinc-800 cursor-pointer text-white bg-zinc-900"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-zinc-300" />
                <span className="text-sm font-medium text-gray-100">
                  Travelers
                </span>
                <ChevronDown className="h-4 w-4 text-zinc-300 ml-auto" />
              </div>
              <div className="text-xs truncate text-gray-300">
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
        <div className="px-8 flex items-center">
          <Button
            onClick={handleSubmit}
            disabled={!isComplete || isProcessing}
            className="rounded-none px-6 py-3 bg-brand-secondary hover:bg-brand-secondary/90"
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
