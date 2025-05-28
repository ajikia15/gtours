"use client";

import { useState, useEffect } from "react";
import { useBooking } from "@/context/booking";
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
import TourDatePicker from "@/components/booking/tour-date-picker";
import TravelerSelection from "@/components/booking/traveler-selection";
import ActivitySelection from "@/components/booking/activity-selection";
import {
  CalendarDays,
  Users,
  MapPin,
  ShoppingCart,
  Edit3,
  ChevronDown,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Simple separator component
const Separator = ({ className }: { className?: string }) => (
  <div className={cn("h-px bg-border", className)} />
);

interface BookingBarProps {
  tours: Tour[];
  /** Mode: 'add' for new booking, 'edit' for modifying existing */
  mode?: "add" | "edit";
  /** Cart item to edit (required when mode is 'edit') */
  editingItem?: CartItem;
  preselectedTour?: Tour;
  onSuccess?: () => void;
  className?: string;
}

type PopoverType = "tour" | "activities" | "date" | "travelers";

export default function BookingBar({
  tours,
  mode = "add",
  editingItem,
  preselectedTour,
  onSuccess,
  className = "",
}: BookingBarProps) {
  const booking = useBooking();

  // Local state
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<Set<string>>(
    new Set()
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [activePopover, setActivePopover] = useState<PopoverType | null>(null);

  // Popover management
  const openPopover = (popover: PopoverType) => setActivePopover(popover);
  const closePopover = () => setActivePopover(null);
  const isPopoverOpen = (popover: PopoverType) => activePopover === popover;

  // Initialize state based on mode
  useEffect(() => {
    if (mode === "edit" && editingItem) {
      const tour = tours.find((t) => t.id === editingItem.tourId);
      if (tour) {
        setSelectedTour(tour);
        setSelectedActivities(new Set(editingItem.selectedActivities));
        booking.updateSharedDate(editingItem.selectedDate);
        booking.updateSharedTravelers(editingItem.travelers);
      }
    } else if (mode === "add" && preselectedTour) {
      setSelectedTour(preselectedTour);
      setSelectedActivities(new Set());
    } else {
      setSelectedTour(null);
      setSelectedActivities(new Set());
    }
  }, [mode, editingItem, preselectedTour, tours, booking]);

  // Get shared state
  const { selectedDate, travelers } = booking.sharedState;

  // Calculate pricing
  const totalPrice =
    selectedTour && selectedTour.basePrice !== undefined
      ? booking.calculateTotalPrice(
          selectedTour,
          travelers,
          Array.from(selectedActivities)
        )
      : 0;

  const pricingBreakdown =
    selectedTour && selectedTour.basePrice !== undefined
      ? booking.getPricingBreakdown(
          selectedTour,
          travelers,
          Array.from(selectedActivities)
        )
      : null;

  // Validate current selection
  const validation = booking.validateBooking({
    selectedDate,
    travelers,
    selectedActivities: Array.from(selectedActivities),
  });

  // Handlers
  const handleTourSelect = (tourId: string) => {
    const tour = tours.find((t) => t.id === tourId);
    if (tour) {
      setSelectedTour(tour);
      setSelectedActivities(new Set());
    }
    closePopover();
  };

  const handleActivitySelectionChange = (selectedIds: string[]) => {
    setSelectedActivities(new Set(selectedIds));
  };

  const handleSubmit = async () => {
    if (!selectedTour || !validation.isComplete) {
      toast.error("Please complete all required fields");
      return;
    }

    setIsProcessing(true);

    try {
      if (mode === "edit" && editingItem) {
        const { updateCartItem } = await import("@/data/cart");
        await updateCartItem(editingItem.id, {
          selectedDate,
          travelers,
          selectedActivities: Array.from(selectedActivities),
          totalPrice,
          activityPriceIncrement: pricingBreakdown?.activityCost || 0,
          carCost: pricingBreakdown?.carCost || 0,
        });
        toast.success("Booking updated successfully!");
      } else {
        const result = await booking.addBookingToCart(
          selectedTour,
          Array.from(selectedActivities)
        );
        if (!result.success) {
          toast.error(result.message || "Failed to add to cart");
          return;
        }
        toast.success("Added to cart successfully!");
      }
      onSuccess?.();
    } catch (error) {
      console.error("operation failed:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedTour(preselectedTour || null);
    setSelectedActivities(new Set());
    booking.resetSharedState();
  };

  // Summary helpers
  const getTourSummary = () => {
    if (!selectedTour) return "Select tour";
    return selectedTour.title;
  };

  const getActivitiesSummary = () => {
    if (selectedActivities.size === 0) return "Select activities";
    return `${selectedActivities.size} activit${
      selectedActivities.size !== 1 ? "ies" : "y"
    }`;
  };

  const getDateSummary = () => {
    if (!selectedDate) return "Select date";
    return selectedDate.toLocaleDateString();
  };

  const getTravelersSummary = () => {
    const total = booking.getTotalPeople(travelers);
    if (total === 0) return "Select travelers";
    return `${total} traveler${total !== 1 ? "s" : ""}`;
  };

  return (
    <Card className={cn("p-6", className)}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
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

        {/* Booking Bar with Popovers */}
        <div className="flex flex-wrap gap-4 items-center">
          {/* Tour Selection */}
          <Popover
            open={isPopoverOpen("tour")}
            onOpenChange={(open) =>
              open ? openPopover("tour") : closePopover()
            }
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "min-w-48 justify-between",
                  !selectedTour && "text-muted-foreground"
                )}
                disabled={mode === "edit" || !!preselectedTour}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {getTourSummary()}
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-3">
                <h4 className="font-medium">Select Tour</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {tours.map((tour) => (
                    <Button
                      key={tour.id}
                      variant={
                        selectedTour?.id === tour.id ? "default" : "ghost"
                      }
                      className="w-full justify-start h-auto p-3"
                      onClick={() => handleTourSelect(tour.id)}
                    >
                      <div className="text-left">
                        <div className="font-medium">{tour.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {tour.basePrice} GEL • {tour.duration} days
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Activities Selection */}
          <Popover
            open={isPopoverOpen("activities")}
            onOpenChange={(open) =>
              open ? openPopover("activities") : closePopover()
            }
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="min-w-48 justify-between"
                disabled={!selectedTour}
              >
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  {selectedTour ? getActivitiesSummary() : "Select tour first"}
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-3">
                <h4 className="font-medium">Select Activities</h4>
                {selectedTour ? (
                  <ActivitySelection
                    activities={selectedTour.offeredActivities || []}
                    selectedActivities={selectedActivities}
                    setSelectedActivities={setSelectedActivities}
                    onSelectionChange={handleActivitySelectionChange}
                  />
                ) : (
                  <p className="text-sm text-gray-500">
                    Please select a tour first
                  </p>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Date Selection */}
          <Popover
            open={isPopoverOpen("date")}
            onOpenChange={(open) =>
              open ? openPopover("date") : closePopover()
            }
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "min-w-48 justify-between",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {getDateSummary()}
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <TourDatePicker
                date={selectedDate}
                setDate={booking.updateSharedDate}
              />
            </PopoverContent>
          </Popover>

          {/* Travelers Selection */}
          <Popover
            open={isPopoverOpen("travelers")}
            onOpenChange={(open) =>
              open ? openPopover("travelers") : closePopover()
            }
          >
            <PopoverTrigger asChild>
              <Button variant="outline" className="min-w-48 justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {getTravelersSummary()}
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-3">
                <h4 className="font-medium">Select Travelers</h4>
                <TravelerSelection
                  travelers={travelers}
                  setTravelers={booking.updateSharedTravelers}
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Pricing Summary */}
        {selectedTour && pricingBreakdown && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Pricing Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Base Price:</span>
                <span>{pricingBreakdown.basePrice} GEL</span>
              </div>
              {pricingBreakdown.activityCost > 0 && (
                <div className="flex justify-between">
                  <span>Activities:</span>
                  <span>+{pricingBreakdown.activityCost} GEL</span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold text-base">
                <span>Total:</span>
                <span className="text-red-600">{totalPrice} GEL</span>
              </div>
            </div>
          </div>
        )}

        {/* Validation Errors */}
        {!validation.isComplete && validation.errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 p-3 rounded">
            <h4 className="text-sm font-medium text-red-800 mb-2">
              Please complete the following:
            </h4>
            <ul className="text-sm text-red-700 space-y-1">
              {validation.errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={isProcessing}
          >
            Reset
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!validation.isComplete || isProcessing}
            className="min-w-32"
          >
            {isProcessing
              ? "Processing..."
              : mode === "edit"
              ? "Update Booking"
              : "Add to Cart"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
