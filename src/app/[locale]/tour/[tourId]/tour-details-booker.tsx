"use client";
import TourDatePicker from "@/components/booking/tour-date-picker";
import TravelerSelection from "@/components/booking/traveler-selection";
import { Button } from "@/components/ui/button";
import ActivitySelection from "@/components/booking/activity-selection";
import { ShoppingCart, ChevronDown, ChevronUp } from "lucide-react";
import { Tour } from "@/types/Tour";
import { useState } from "react";
import { addToCart } from "@/data/cart";
import { useAuth } from "@/context/auth";
import { toast } from "sonner";

export type TravelerCounts = {
  adults: number;
  children: number;
  infants: number;
};

export default function TourDetailsBooker({ tour }: { tour: Tour }) {
  const auth = useAuth();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [date, setDate] = useState<Date>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });

  const [travelers, setTravelers] = useState<TravelerCounts>({
    adults: 2,
    children: 0,
    infants: 0,
  });

  const [selectedActivities, setSelectedActivities] = useState<Set<string>>(
    new Set()
  );

  // Calculate activity price increment
  const calculateActivityPriceIncrement = () => {
    return Array.from(selectedActivities).reduce((total, activityId) => {
      const activity = tour.offeredActivities.find(
        (a) => a.activityTypeId === activityId
      );
      return total + (activity?.priceIncrement || 0);
    }, 0);
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    const basePrice = tour.basePrice;
    const totalPeople = travelers.adults + travelers.children;

    // Base price is fixed and includes 1 car cost (up to 6 people)
    const baseCost = basePrice;

    // Calculate additional car costs (every 6th tourist beyond the first 6 requires +200 GEL)
    const additionalCars = Math.max(0, Math.floor((totalPeople - 1) / 6));
    const carCost = additionalCars * 200;

    const activityIncrement = calculateActivityPriceIncrement();
    return baseCost + carCost + activityIncrement;
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!auth?.currentUser) {
      toast.error("Please sign in to add items to cart");
      return;
    }

    setIsAddingToCart(true);

    try {
      const result = await addToCart({
        tourId: tour.id,
        tourTitle: tour.title,
        tourBasePrice: tour.basePrice,
        tourImages: tour.images,
        selectedDate: date,
        travelers,
        selectedActivities: Array.from(selectedActivities),
      });

      if (result.success) {
        toast.success("Tour added to cart!");
      } else {
        toast.error(result.message || "Failed to add to cart");
      }
    } catch (error) {
      toast.error("Failed to add to cart");
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
          <TourDatePicker date={date} setDate={setDate} />
          <h2 className="text-lg font-semibold text-gray-900">Travelers</h2>
          <TravelerSelection
            travelers={travelers}
            setTravelers={setTravelers}
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
