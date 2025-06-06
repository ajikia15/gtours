"use client";

import { useState } from "react";
import BookingBar from "@/components/booking-bar";
import { Tour } from "@/types/Tour";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "@/i18n/navigation";
import { getLocalizedTitle } from "@/lib/localizationHelpers";
import { useLocale } from "next-intl";

import { ShoppingCart, Plus } from "lucide-react";

interface BookingPageClientProps {
  tours: Tour[];
  preselectedTour?: Tour | null;
}

export default function BookingPageClient({
  tours,
  preselectedTour,
}: BookingPageClientProps) {
  const [showQuickBooking, setShowQuickBooking] = useState(false);
  const router = useRouter();
  const locale = useLocale();

  const handleSuccess = () => {
    // Redirect to cart after successful booking
    router.push("/cart");
  };

  const handleQuickBookingSuccess = () => {
    setShowQuickBooking(false);
    // Optionally redirect to cart or show a toast
  };

  return (
    <div className="space-y-8">
      {/* Quick Booking Header Example */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          {!showQuickBooking ? (
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold">Quick Booking Header</h2>
                <span className="text-sm text-gray-600">
                  Compact booking interface for headers/navigation
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/cart")}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart
                </Button>
                <Button onClick={() => setShowQuickBooking(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Quick Book
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Quick Booking</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowQuickBooking(false)}
                >
                  Cancel
                </Button>
              </div>
              <BookingBar
                tours={tours}
                mode="add"
                onSuccess={handleQuickBookingSuccess}
                className="border-0 shadow-none"
                preselectedTour={preselectedTour || undefined}
              />
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto py-8 space-y-8">
        <div className="text-center space-y-4">          <h1 className="text-3xl font-bold">
            {preselectedTour
              ? `Book ${getLocalizedTitle(preselectedTour, locale)}`
              : "Create New Booking"}
          </h1>          <p className="text-gray-600 max-w-2xl mx-auto">
            {preselectedTour
              ? `Complete your booking for ${getLocalizedTitle(preselectedTour, locale)}. Select your activities, date, and travelers.`
              : "Select your tour, activities, date, and travelers to create a new booking. You can choose between the full interface or compact popover mode."}
          </p>
          {preselectedTour && (            <Badge variant="secondary" className="text-sm">
              Tour preselected: {getLocalizedTitle(preselectedTour, locale)}
            </Badge>
          )}
        </div>

        <BookingBar
          tours={tours}
          mode="add"
          onSuccess={handleSuccess}
          preselectedTour={preselectedTour || undefined}
        />

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => router.push("/cart")}>
              View Cart
            </Button>
            <Button variant="outline" onClick={() => router.push("/tours")}>
              Browse Tours
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
