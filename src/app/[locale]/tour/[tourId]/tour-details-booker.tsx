"use client";
import TourDatePicker from "@/components/booking/tour-date-picker";
import TravelerSelection from "@/components/booking/traveler-selection";
import { Button } from "@/components/ui/button";
import ActivitySelection from "@/components/booking/activity-selection";
import { ShoppingCart, ChevronDown, ChevronUp } from "lucide-react";
import { Tour } from "@/types/Tour";
import { useState } from "react";

export type TravelerCounts = {
  adults: number;
  children: number;
  infants: number;
};

export default function TourDetailsBooker({ tour }: { tour: Tour }) {
  const [isExpanded, setIsExpanded] = useState(true);
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
          <span className="text-lg font-semibold text-gray-900">
            Total: <span className="text-red-500">{tour.basePrice} GEL</span>
          </span>
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

          <Button className="w-full" variant="outline">
            <ShoppingCart className="size-4 mr-2" />
            Add to Cart
          </Button>

          <Button className="w-full" variant="brandred" size="lg">
            Book Tour Now
          </Button>
        </div>
      )}
    </>
  );
}
