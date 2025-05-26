"use client";

import { Tour } from "@/types/Tour";
import { TravelerCounts } from "@/types/Booking";
import { useBooking } from "@/context/booking";
import { AlertCircle, CheckCircle } from "lucide-react";

interface BookingSummaryProps {
  tour: Tour;
  travelers: TravelerCounts;
  selectedActivities: string[];
  selectedDate?: Date;
  showValidation?: boolean;
}

export default function BookingSummary({
  tour,
  travelers,
  selectedActivities,
  selectedDate,
  showValidation = false,
}: BookingSummaryProps) {
  const booking = useBooking();

  // Get pricing breakdown
  const pricingBreakdown = booking.getPricingBreakdown(
    tour,
    travelers,
    selectedActivities
  );

  // Get validation if requested
  const validation = showValidation
    ? booking.validateBooking({ selectedDate, travelers, selectedActivities })
    : null;

  const totalPeople = booking.getTotalPeople(travelers);

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
      {/* Traveler Summary */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">Travelers:</span>
        <span className="font-medium">
          {totalPeople} {totalPeople === 1 ? "person" : "people"}
        </span>
      </div>

      {/* Activities Summary */}
      {selectedActivities.length > 0 && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Activities:</span>
          <span className="font-medium">
            {selectedActivities.length} selected
          </span>
        </div>
      )}

      {/* Pricing Breakdown */}
      <div className="border-t pt-3 space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Base Price:</span>
          <span>{pricingBreakdown.basePrice} GEL</span>
        </div>

        {pricingBreakdown.activityCost > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Activities:</span>
            <span>+{pricingBreakdown.activityCost} GEL</span>
          </div>
        )}

        {/* Car cost is hidden from users but calculated in total */}

        <div className="flex justify-between items-center font-semibold border-t pt-2">
          <span>Total:</span>
          <span className="text-red-500">
            {pricingBreakdown.totalPrice} GEL
          </span>
        </div>
      </div>

      {/* Validation Messages */}
      {showValidation && validation && (
        <div className="border-t pt-3">
          {validation.isComplete ? (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle className="h-4 w-4" />
              <span>Booking is ready</span>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-amber-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>Booking incomplete</span>
              </div>
              <ul className="text-xs text-gray-600 ml-6 space-y-1">
                {validation.errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
