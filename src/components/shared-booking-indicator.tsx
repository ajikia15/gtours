"use client";

import { useCart } from "@/context/cart";
import { useBooking } from "@/context/booking";
import { Info, Users, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function SharedBookingIndicator() {
  const cart = useCart();
  const booking = useBooking();

  const hasMultipleTours = cart.items.length > 1;
  const { selectedDate, travelers } = booking.sharedState;

  if (!hasMultipleTours || cart.loading) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-blue-900 mb-2">
            Shared Trip Details
          </h3>
          <p className="text-sm text-blue-700 mb-3">
            You have {cart.items.length} tours in your cart. Your travel details
            are shared across all tours:
          </p>

          <div className="space-y-2 text-sm">
            {selectedDate && (
              <div className="flex items-center gap-2 text-blue-800">
                <Calendar className="h-4 w-4" />
                <span>Trip starts: {format(selectedDate, "PPP")}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-blue-800">
              <Users className="h-4 w-4" />
              <span>
                {travelers.adults} adults
                {travelers.children > 0 && `, ${travelers.children} children`}
                {travelers.infants > 0 && `, ${travelers.infants} infants`}
              </span>
            </div>
          </div>

          <p className="text-xs text-blue-600 mt-3">
            Changes to date or travelers will update all tours in your cart.
          </p>
        </div>
      </div>
    </div>
  );
}
