"use client";

import { useState, useEffect } from "react";
import { useBooking } from "@/context/booking";
import { useCart } from "@/context/cart";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Simple separator component
const Separator = ({ className }: { className?: string }) => (
  <div className={cn("h-px bg-border", className)} />
);

interface BookingBarProps {
  /** Available tours to select from */
  tours: Tour[];
  /** Mode: 'add' for new booking, 'edit' for modifying existing */
  mode?: "add" | "edit";
  /** Cart item to edit (required when mode is 'edit') */
  editingItem?: CartItem;
  /** Pre-selected tour (optional, for add mode) */
  preselectedTour?: Tour;
  /** Callback when booking is successfully added/updated */
  onSuccess?: () => void;
  /** Custom styling classes */
  className?: string;
  /** Use popover mode for compact display */
  usePopovers?: boolean;
}

export default function BookingBar({
  tours,
  mode = "add",
  editingItem,
  preselectedTour,
  onSuccess,
  className = "",
  usePopovers = false,
}: BookingBarProps) {
  const booking = useBooking();
  const cart = useCart();

  // Local state for the booking bar
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<Set<string>>(
    new Set()
  );
  const [isProcessing, setIsProcessing] = useState(false);

  // Popover states - only one can be open at a time
  const [activePopover, setActivePopover] = useState<
    "date" | "travelers" | "activities" | null
  >(null);

  // Helper functions for popover state management
  const openPopover = (popover: "date" | "travelers" | "activities") => {
    setActivePopover(popover);
  };

  const closePopover = () => {
    setActivePopover(null);
  };

  const isPopoverOpen = (popover: "date" | "travelers" | "activities") => {
    return activePopover === popover;
  };

  // Initialize state based on mode
  useEffect(() => {
    if (mode === "edit" && editingItem) {
      // Edit mode: Load existing cart item data
      const tour = tours.find((t) => t.id === editingItem.tourId);
      if (tour) {
        setSelectedTour(tour);
        setSelectedActivities(new Set(editingItem.selectedActivities));

        // Update shared state with item's data
        booking.updateSharedDate(editingItem.selectedDate);
        booking.updateSharedTravelers(editingItem.travelers);
      }
    } else if (mode === "add" && preselectedTour) {
      // Add mode with preselected tour
      setSelectedTour(preselectedTour);
      setSelectedActivities(new Set());
    } else {
      // Fresh start
      setSelectedTour(null);
      setSelectedActivities(new Set());
    }
  }, [mode, editingItem, preselectedTour, tours]); // Removed 'booking' from dependencies

  // Get shared state
  const { selectedDate, travelers } = booking.sharedState;

  // Calculate pricing - only if we have a complete tour object
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

  // Handle tour selection
  const handleTourSelect = (tourId: string) => {
    const tour = tours.find((t) => t.id === tourId);
    if (tour) {
      setSelectedTour(tour);
      setSelectedActivities(new Set()); // Reset activities when tour changes
    }
  };

  // Handle activity selection
  const handleActivitySelectionChange = (selectedIds: string[]) => {
    setSelectedActivities(new Set(selectedIds));
  };

  // Handle submit (add to cart or update cart item)
  const handleSubmit = async () => {
    if (!selectedTour || !validation.isComplete) {
      toast.error("Please complete all required fields");
      return;
    }

    setIsProcessing(true);

    try {
      if (mode === "edit" && editingItem) {
        // Update existing cart item
        const { updateCartItem } = await import("@/data/cart");
        await updateCartItem(editingItem.id, {
          selectedDate,
          travelers,
          selectedActivities: Array.from(selectedActivities),
          // Recalculate pricing
          totalPrice,
          activityPriceIncrement: pricingBreakdown?.activityCost || 0,
          carCost: pricingBreakdown?.carCost || 0,
        });

        toast.success("Booking updated successfully!");
      } else {
        // Add new item to cart
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
      console.error("Booking operation failed:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset to fresh state
  const handleReset = () => {
    setSelectedTour(preselectedTour || null);
    setSelectedActivities(new Set());
    booking.resetSharedState();
  };

  // Helper function to get summary text
  const getTravelersSummary = () => {
    const total = booking.getTotalPeople(travelers);
    if (total === 0) return "Select travelers";
    return `${total} traveler${total !== 1 ? "s" : ""}`;
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

  // Render date selector (popover or inline)
  const renderDateSelector = () => {
    const content = (
      <TourDatePicker date={selectedDate} setDate={booking.updateSharedDate} />
    );

    if (usePopovers) {
      return (
        <Popover
          open={isPopoverOpen("date")}
          onOpenChange={(open) => (open ? openPopover("date") : closePopover())}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-between",
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
            {content}
          </PopoverContent>
        </Popover>
      );
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <CalendarDays className="h-4 w-4" />
          When?
        </div>
        {content}
      </div>
    );
  };

  // Render travelers selector (popover or inline)
  const renderTravelersSelector = () => {
    const content = (
      <TravelerSelection
        travelers={travelers}
        setTravelers={booking.updateSharedTravelers}
      />
    );

    if (usePopovers) {
      return (
        <Popover
          open={isPopoverOpen("travelers")}
          onOpenChange={(open) =>
            open ? openPopover("travelers") : closePopover()
          }
        >
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {getTravelersSummary()}
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            {content}
          </PopoverContent>
        </Popover>
      );
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Users className="h-4 w-4" />
          Who?
        </div>
        {content}
      </div>
    );
  };

  // Render activities selector (popover or inline)
  const renderActivitiesSelector = () => {
    if (!selectedTour) {
      const placeholder = (
        <div className="text-sm text-gray-400 p-4 border-2 border-dashed border-gray-200 rounded text-center">
          Select a tour first
        </div>
      );

      if (usePopovers) {
        return (
          <Button variant="outline" className="w-full" disabled>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Select a tour first
            </div>
          </Button>
        );
      }

      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <CalendarDays className="h-4 w-4" />
            Activities
          </div>
          {placeholder}
        </div>
      );
    }

    const content = (
      <ActivitySelection
        activities={selectedTour.offeredActivities || []}
        selectedActivities={selectedActivities}
        setSelectedActivities={setSelectedActivities}
        onSelectionChange={handleActivitySelectionChange}
      />
    );

    if (usePopovers) {
      return (
        <Popover
          open={isPopoverOpen("activities")}
          onOpenChange={(open) =>
            open ? openPopover("activities") : closePopover()
          }
        >
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {getActivitiesSummary()}
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            {content}
          </PopoverContent>
        </Popover>
      );
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <CalendarDays className="h-4 w-4" />
          Activities
        </div>
        {content}
      </div>
    );
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

        {/* Booking Form */}
        <div
          className={cn(
            "gap-6",
            usePopovers
              ? "flex flex-wrap items-center"
              : "grid grid-cols-1 lg:grid-cols-4"
          )}
        >
          {/* Tour Selection */}
          <div className={cn(usePopovers ? "min-w-48" : "space-y-3")}>
            {!usePopovers && (
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <MapPin className="h-4 w-4" />
                Where?
              </div>
            )}

            <Select
              value={selectedTour?.id || ""}
              onValueChange={handleTourSelect}
              disabled={mode === "edit" || !!preselectedTour} // Can't change tour in edit mode or when preselected
            >
              <SelectTrigger className={cn(usePopovers && "min-w-48")}>
                <div className="flex items-center gap-2">
                  {usePopovers && <MapPin className="h-4 w-4" />}
                  <SelectValue
                    placeholder={usePopovers ? "Select tour" : "Select a tour"}
                  />
                </div>
              </SelectTrigger>
              <SelectContent>
                {tours.map((tour) => (
                  <SelectItem key={tour.id} value={tour.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{tour.title}</span>
                      <span className="text-sm text-gray-500">
                        {tour.basePrice} GEL • {tour.duration} days
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {!usePopovers && selectedTour && (
              <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
                <p>
                  <strong>Duration:</strong> {selectedTour.duration} days
                </p>
                <p>
                  <strong>Departs:</strong> {selectedTour.leaveTime}
                </p>
                <p>
                  <strong>Returns:</strong> {selectedTour.returnTime}
                </p>
              </div>
            )}
          </div>

          {/* Activities */}
          <div className={cn(usePopovers ? "min-w-48" : "")}>
            {renderActivitiesSelector()}
          </div>

          {/* Date Selection */}
          <div className={cn(usePopovers ? "min-w-48" : "")}>
            {renderDateSelector()}
          </div>

          {/* Travelers */}
          <div className={cn(usePopovers ? "min-w-48" : "")}>
            {renderTravelersSelector()}
          </div>
        </div>

        {!usePopovers && <Separator />}

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
