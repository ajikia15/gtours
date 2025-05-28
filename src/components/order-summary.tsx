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
  const [expandedTours, setExpandedTours] = useState<Set<string>>(new Set());

  const isCartMode = mode === "cart";
  const { selectedDate, travelers } = booking?.sharedState || {};
  const hasMultipleTours = isCartMode && cart.items.length > 1;
  const incompleteItems = isCartMode
    ? cart.items.filter((item) => item.status === "incomplete")
    : [];
  const readyItems = isCartMode
    ? cart.items.filter((item) => item.status === "ready")
    : [];

  // Calculate totals
  const subtotal = isCartMode
    ? cart.totalPrice
    : customSubtotal ??
      customItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const tax = customTax ?? (isCheckout ? subtotal * 0.18 : 0);
  const total = customTotal ?? subtotal + tax;

  const toggleTourExpansion = (tourId: string) => {
    const newExpanded = new Set(expandedTours);
    if (newExpanded.has(tourId)) {
      newExpanded.delete(tourId);
    } else {
      newExpanded.add(tourId);
    }
    setExpandedTours(newExpanded);
  };

  const getDefaultButtonText = () => {
    if (isCheckout) {
      return disabled
        ? "Complete Profile to Continue"
        : `Complete Purchase - ${
            isCartMode ? cart.totalPrice : total.toFixed(2)
          } ${isCartMode ? "GEL" : "$"}`;
    }
    return "Proceed to Checkout";
  };

  const getDefaultButtonAction = () => {
    if (buttonAction) return buttonAction;
    if (isCheckout) return () => {};
    return () => router.push("/account/checkout");
  };

  // Render individual activity with price
  const renderActivity = (activityId: string, priceIncrement: number) => (
    <div key={activityId} className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-1.5">
        {getActivityIcon(activityId, true, 12)}
        <span className="text-gray-600">{quickCategory(activityId)}</span>
      </div>
      <span className="text-gray-700 font-medium">+{priceIncrement} GEL</span>
    </div>
  );

  // Get individual activity prices from the cart item's tour data
  const getActivityPrices = (
    item: any
  ): Array<{ activityId: string; priceIncrement: number }> => {
    // If tour data is available in the cart item, use it
    if (item.tourData?.offeredActivities) {
      return item.selectedActivities.map((activityId: string) => {
        const activity = item.tourData.offeredActivities.find(
          (a: any) => a.activityTypeId === activityId
        );
        return {
          activityId,
          priceIncrement: activity?.priceIncrement || 0,
        };
      });
    }

    // Fallback: divide total increment by number of activities
    const avgIncrement =
      item.selectedActivities.length > 0
        ? Math.floor(
            item.activityPriceIncrement / item.selectedActivities.length
          )
        : 0;

    return item.selectedActivities.map((activityId: string) => ({
      activityId,
      priceIncrement: avgIncrement,
    }));
  };

  // Render detailed tour breakdown
  const renderTourBreakdown = (item: any) => {
    const isExpanded = expandedTours.has(item.id);
    const hasActivities =
      item.selectedActivities && item.selectedActivities.length > 0;
    const activityPrices = hasActivities ? getActivityPrices(item) : [];

    return (
      <div key={item.id} className="border rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-sm text-gray-900 leading-tight">
                {item.tourTitle}
              </h4>
              {hasActivities && (
                <button
                  onClick={() => toggleTourExpansion(item.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  {isExpanded ? (
                    <ChevronUp className="h-3 w-3 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-3 w-3 text-gray-500" />
                  )}
                </button>
              )}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500">Tbilisi, Georgia</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-900">
              {item.totalPrice} GEL
            </div>
            <div className="text-xs text-gray-500">
              Base: {item.tourBasePrice} GEL
            </div>
          </div>
        </div>

        {/* Expanded details */}
        {isExpanded && hasActivities && (
          <div className="pt-2 border-t space-y-1">
            <div className="text-xs text-gray-600 font-medium mb-1">
              Activities included:
            </div>
            {activityPrices.map(({ activityId, priceIncrement }) =>
              renderActivity(activityId, priceIncrement)
            )}
            {item.activityPriceIncrement > 0 && (
              <div className="pt-1 border-t">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Activities total:</span>
                  <span className="font-medium text-gray-900">
                    +{item.activityPriceIncrement} GEL
                  </span>
                </div>
              </div>
            )}
            {/* Show hidden car costs for transparency (optional) */}
            {item.carCost > 0 && (
              <div className="pt-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Additional cars:</span>
                  <span className="font-medium text-gray-900">
                    +{item.carCost} GEL
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Status indicator */}
        <div className="flex items-center gap-2 pt-1">
          {item.status === "ready" ? (
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-700">Ready for booking</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3 text-amber-600" />
              <span className="text-xs text-amber-700">Needs completion</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4 ${className}`}
    >
      <h2 className="text-lg font-semibold mb-4">{title}</h2>

      {/* Trip Details (only for cart mode) */}
      {isCartMode && showTripDetails && (
        <>
          {/* Shared Trip Details for multiple tours */}
          {hasMultipleTours && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-medium text-blue-900 mb-2">
                    Shared Trip Details
                  </h3>
                  <p className="text-sm text-blue-700 mb-3">
                    Your travel details are shared across all{" "}
                    {cart.items.length} tours:
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
                        {travelers?.adults} adults
                        {travelers?.children &&
                          travelers.children > 0 &&
                          `, ${travelers.children} children`}
                        {travelers?.infants &&
                          travelers.infants > 0 &&
                          `, ${travelers.infants} infants`}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-blue-600 mt-3">
                    Changes to date or travelers will update all tours in your
                    cart.
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
                    {travelers?.adults} adults
                    {travelers?.children &&
                      travelers.children > 0 &&
                      `, ${travelers.children} children`}
                    {travelers?.infants &&
                      travelers.infants > 0 &&
                      `, ${travelers.infants} infants`}
                  </span>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Booking Status (only for cart mode) */}
      {isCartMode && showBookingStatus && cart.items.length > 0 && (
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

      {/* Items List */}
      <div className="space-y-3 mb-4">
        {isCartMode ? (
          // Cart mode: show detailed tour breakdown
          <>
            {showDetailedBreakdown && cart.items.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">
                    Tours ({cart.totalItems})
                  </h3>
                  <span className="font-semibold text-gray-900">
                    {cart.totalPrice} GEL
                  </span>
                </div>
                {cart.items.map((item) => renderTourBreakdown(item))}
              </div>
            ) : (
              // Simple breakdown for minimal display
              <>
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
              </>
            )}
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

      {/* Price breakdown for checkout */}
      {isCheckout && (
        <>
          <Separator className="mb-4" />
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>
        </>
      )}

      <Separator className="mb-4" />

      {/* Total */}
      <div className="flex justify-between text-lg font-semibold mb-6">
        <span>Total</span>
        <span className={isCartMode ? "text-red-600" : ""}>
          {isCartMode ? `${cart.totalPrice} GEL` : `$${total.toFixed(2)}`}
        </span>
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
            {disabled && isCheckout ? (
              <>
                <LockIcon className="h-4 w-4 mr-2" />
                {buttonText || getDefaultButtonText()}
              </>
            ) : (
              buttonText || getDefaultButtonText()
            )}
          </Button>

          {(disabled || (isCartMode && incompleteItems.length > 0)) && (
            <p className="text-xs text-amber-600 text-center">
              {disabledReason ||
                (isCartMode
                  ? "Complete all tour details to proceed with booking"
                  : "Your contact information is required to process your order")}
            </p>
          )}
        </div>
      )}

      {/* Help Text */}
      <div className="mt-4 pt-4 border-t">
        <p className="text-xs text-gray-500 text-center">
          Need help?{" "}
          <Link href="/contact" className="text-blue-600 hover:underline">
            Contact us
          </Link>
        </p>
      </div>
    </div>
  );
}
