"use client";

import { useCart } from "@/context/cart";
import { useBooking } from "@/context/booking";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, AlertCircle, CheckCircle, Info } from "lucide-react";
import { format } from "date-fns";

export default function CartOrderSummary() {
  const cart = useCart();
  const booking = useBooking();

  const { selectedDate, travelers } = booking.sharedState;
  const hasMultipleTours = cart.items.length > 1;
  const incompleteItems = cart.items.filter(
    (item) => item.status === "incomplete"
  );
  const readyItems = cart.items.filter((item) => item.status === "ready");

  const getTotalPeople = () => {
    return travelers.adults + travelers.children + travelers.infants;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

      {/* Shared Trip Details */}
      {hasMultipleTours && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-medium text-blue-900 mb-2">
                Shared Trip Details
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                Your travel details are shared across all {cart.items.length}{" "}
                tours:
              </p>

              <div className="space-y-2 text-sm">
                {selectedDate ? (
                  <div className="flex items-center gap-2 text-blue-800">
                    <Calendar className="h-4 w-4" />
                    <span>Trip starts: {format(selectedDate, "PPP")}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-600">
                    <Calendar className="h-4 w-4" />
                    <span>Trip date not selected</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-blue-800">
                  <Users className="h-4 w-4" />
                  <span>
                    {travelers.adults} adults
                    {travelers.children > 0 &&
                      `, ${travelers.children} children`}
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
      )}

      {/* Single Tour Details */}
      {!hasMultipleTours && cart.items.length === 1 && (
        <div className="border-b pb-4 mb-4">
          <h3 className="font-medium text-gray-900 mb-3">Trip Details</h3>
          <div className="space-y-2 text-sm">
            {selectedDate ? (
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="h-4 w-4" />
                <span>{format(selectedDate, "PPP")}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-amber-600">
                <Calendar className="h-4 w-4" />
                <span>Date not selected</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-gray-700">
              <Users className="h-4 w-4" />
              <span>
                {travelers.adults} adults
                {travelers.children > 0 && `, ${travelers.children} children`}
                {travelers.infants > 0 && `, ${travelers.infants} infants`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Booking Status */}
      {cart.items.length > 0 && (
        <div className="border-b pb-4 mb-4">
          <h3 className="font-medium text-gray-900 mb-3">Booking Status</h3>
          <div className="space-y-2">
            {readyItems.length > 0 && (
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">
                  {readyItems.length} tour{readyItems.length !== 1 ? "s" : ""}{" "}
                  ready for booking
                </span>
              </div>
            )}

            {incompleteItems.length > 0 && (
              <div className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">
                  {incompleteItems.length} tour
                  {incompleteItems.length !== 1 ? "s" : ""} need
                  {incompleteItems.length === 1 ? "s" : ""} completion
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span>Tours ({cart.totalItems})</span>
          <span>{cart.totalPrice} GEL</span>
        </div>

        {cart.items.some((item) => item.activityPriceIncrement > 0) && (
          <div className="flex justify-between text-sm text-gray-600">
            <span>Activities included</span>
            <span>
              +
              {cart.items.reduce(
                (sum, item) => sum + item.activityPriceIncrement,
                0
              )}{" "}
              GEL
            </span>
          </div>
        )}
      </div>

      <div className="border-t pt-4 mb-6">
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span className="text-red-600">{cart.totalPrice} GEL</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          className="w-full"
          size="lg"
          disabled={incompleteItems.length > 0}
        >
          Proceed to Checkout
        </Button>

        {incompleteItems.length > 0 && (
          <p className="text-xs text-amber-600 text-center">
            Complete all tour details to proceed with booking
          </p>
        )}
      </div>

      {/* Help Text */}
      <div className="mt-4 pt-4 border-t">
        <p className="text-xs text-gray-500 text-center">
          Need help?{" "}
          <a href="/contact" className="text-blue-600 hover:underline">
            Contact us
          </a>
        </p>
      </div>
    </div>
  );
}
