"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Users,
  AlertCircle,
  CheckCircle,
  Info,
  LockIcon,
  MapPin,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { format } from "date-fns";
import { useCart } from "@/context/cart";
import { useBooking } from "@/context/booking";
import { Link, useRouter } from "@/i18n/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { getActivityIcon } from "@/lib/imageHelpers";

// Type for simple order items (like on checkout page)
export interface SimpleOrderItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  description?: string;
}

interface OrderSummaryProps {
  // Mode to determine data source
  mode?: "cart" | "custom";

  // For custom mode
  customItems?: SimpleOrderItem[];
  customSubtotal?: number;
  customTax?: number;
  customTotal?: number;

  // Checkout specific props
  isCheckout?: boolean;
  disabled?: boolean;
  disabledReason?: string;

  // Action button props
  buttonText?: string;
  buttonAction?: () => void;
  showButton?: boolean;

  // Additional customizations
  title?: string;
  showTripDetails?: boolean;
  showBookingStatus?: boolean;
  showDetailedBreakdown?: boolean;
  className?: string;
}

export default function OrderSummary({
  mode = "cart",
  customItems = [],
  customSubtotal,
  customTax,
  customTotal,
  isCheckout = false,
  disabled = false,
  disabledReason,
  buttonText,
  buttonAction,
  showButton = true,
  title = "Order Summary",
  showTripDetails = true,
  showBookingStatus = true,
  showDetailedBreakdown = true,
  className = "",
}: OrderSummaryProps) {
  const cart = useCart();
  const booking = useBooking();
  const router = useRouter();
  const quickCategory = useTranslations("QuickCategory");

  const isCartMode = mode === "cart";
  const { selectedDate, travelers } = booking?.sharedState || {};
  const incompleteItems = isCartMode
    ? cart.items.filter((item) => item.status === "incomplete")
    : [];

  // Calculate totals
  const subtotal = isCartMode
    ? cart.totalPrice
    : customSubtotal ??
      customItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const tax = customTax ?? (isCheckout ? subtotal * 0.18 : 0);
  const total = customTotal ?? subtotal + tax;

  const getDefaultButtonAction = () => {
    if (buttonAction) return buttonAction;
    if (isCheckout) return () => {};
    return () => router.push("/account/checkout");
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4 ${className}`}
    >
      <h2 className="text-lg font-semibold mb-4">{title}</h2>

      {/* Simplified Items List */}
      <div className="space-y-3 mb-4">
        {isCartMode ? (
          <>
            {/* Tours */}
            <div className="flex justify-between text-sm">
              <span>
                <span className="font-bold">Tours</span> - {cart.items.length}
              </span>
              <span>
                {cart.items.reduce(
                  (sum, item) => sum + (item.tourBasePrice || 0),
                  0
                )}{" "}
                GEL
              </span>
            </div>

            {/* Start Date */}
            <div className="flex justify-between text-sm">
              <span className="font-bold">Start date</span>
              {selectedDate ? (
                <span>{format(selectedDate, "PPP")}</span>
              ) : (
                <span className="italic text-gray-500">finish booking</span>
              )}
            </div>

            {/* Amount of tourists */}
            <div className="flex justify-between text-sm">
              <span>
                <span className="font-bold">Tourists</span> -{" "}
                {(travelers?.adults ?? 0) +
                  (travelers?.children ?? 0) +
                  (travelers?.infants ?? 0)}
              </span>
              <span>
                +
                {cart.items.reduce((sum, item) => sum + (item.carCost || 0), 0)}{" "}
                GEL
              </span>
            </div>

            {/* Amount of activities */}
            <div className="flex justify-between text-sm">
              <span>
                <span className="font-bold">Activities</span> -{" "}
                {cart.items.reduce(
                  (total, item) =>
                    total + (item.selectedActivities?.length || 0),
                  0
                )}
              </span>
              <span>
                +
                {cart.items.reduce(
                  (sum, item) => sum + (item.activityPriceIncrement || 0),
                  0
                )}{" "}
                GEL
              </span>
            </div>

            {/* Locations */}
            <div className="flex justify-between text-sm">
              <span className="font-bold">Locations</span>
              <span className="font-bold text-right">
                {cart.items.map((item) => item.tourTitle).join(", ")}
              </span>
            </div>
          </>
        ) : (
          // Custom mode: show custom items
          customItems.map((item) => (
            <div key={item.id} className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-medium text-sm">{item.name}</p>
                {item.description && (
                  <p className="text-xs text-gray-500">{item.description}</p>
                )}
                <p className="text-xs text-gray-500">
                  Quantity: {item.quantity}
                </p>
              </div>
              <p className="font-medium">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Total Price Section */}
      <div className="border-t border-b border-gray-300 py-4 mb-4">
        <div className="flex justify-between text-base font-semibold">
          <span>Total price</span>
          <span className="text-black">
            {isCartMode ? `${cart.totalPrice} GEL` : `$${total.toFixed(2)}`}
          </span>
        </div>
      </div>

      {/* Status Message */}
      <div className="text-center mb-2">
        <p className="text-xs text-gray-600">
          {isCartMode && incompleteItems.length > 0
            ? "Finish booking before payment"
            : "You can proceed to checkout"}
        </p>
      </div>

      {/* Action Button */}
      {showButton && (
        <div className="space-y-3">
          <Button
            className="w-full"
            size="lg"
            disabled={disabled || (isCartMode && incompleteItems.length > 0)}
            onClick={getDefaultButtonAction()}
          >
            Checkout
          </Button>

          {(disabled || (isCartMode && incompleteItems.length > 0)) && (
            <p className="text-xs text-amber-600 text-center">
              {disabledReason ||
                (isCartMode
                  ? ""
                  : "Your contact information is required to process your order")}
            </p>
          )}
        </div>
      )}

      {/* Help Text */}
      <div className="mt-4 pt-4 border-t">
        <p className="text-xs text-gray-500 text-center">
          Need help?{" "}
          <Link
            href="/contact"
            className="font-semibold text-red-600 hover:underline"
          >
            Contact us
          </Link>
        </p>
      </div>
    </div>
  );
}
