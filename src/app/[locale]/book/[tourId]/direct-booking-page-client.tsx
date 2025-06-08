"use client";

import { useRouter } from "@/i18n/navigation";
import BookingBar from "@/components/booking-bar";
import { Tour } from "@/types/Tour";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, Info } from "lucide-react";
import { useBooking } from "@/context/booking";
import { useCart } from "@/context/cart";

interface DirectBookingPageClientProps {
  tours: Tour[];
  tour: Tour;
}

export default function DirectBookingPageClient({
  tours,
  tour,
}: DirectBookingPageClientProps) {
  const router = useRouter();
  const booking = useBooking();
  const cart = useCart();

  const handleBack = () => {
    router.back();
  };

  // Check what data is pre-filled
  const { selectedDate, travelers } = booking.sharedState;
  const existingCartItem = cart.items.find((item) => item.tourId === tour.id);
  
  const hasPrefilledDate = selectedDate !== undefined;
  const hasPrefilledTravelers = travelers.adults > 2 || travelers.children > 0 || travelers.infants > 0;
  const hasPrefilledActivities = existingCartItem && existingCartItem.selectedActivities.length > 0;
  
  const hasAnyPrefill = hasPrefilledDate || hasPrefilledTravelers || hasPrefilledActivities;

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Book Tour</h1>
          <p className="text-gray-600">
            Complete your booking for {tour.title[0]}
          </p>
        </div>
      </div>

      {/* Pre-fill Indicator */}
      {hasAnyPrefill && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-medium text-blue-900 mb-2">
                <Info className="h-4 w-4 inline mr-2" />
                Pre-filled Information
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                {hasPrefilledDate && (
                  <li>• Date: {selectedDate?.toLocaleDateString()}</li>
                )}
                {hasPrefilledTravelers && (
                  <li>
                    • Travelers: {travelers.adults} adults
                    {travelers.children > 0 && `, ${travelers.children} children`}
                    {travelers.infants > 0 && `, ${travelers.infants} infants`}
                  </li>
                )}
                {hasPrefilledActivities && (
                  <li>• Activities: {existingCartItem!.selectedActivities.length} selected</li>
                )}
              </ul>
              <p className="text-xs text-blue-700 mt-2">
                This information was carried over from your previous selections. You can modify it below.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Tour Info */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="secondary">Direct Booking</Badge>
            <div>
              <h3 className="font-semibold">{tour.title[0]}</h3>
              <p className="text-sm text-gray-600">
                Starting from {tour.basePrice} GEL per person
              </p>
            </div>
          </div>
          <div className="text-right text-sm text-gray-500">
            <p>Duration: {tour.duration} hours</p>
            <p>Departure: {tour.leaveTime}</p>
          </div>
        </div>
      </Card>

      {/* Booking Form */}
      <BookingBar
        tours={tours}
        mode="add"
        preselectedTour={tour}
        directBooking={true}
      />

      {/* Help Text */}
      <Card className="p-4 bg-green-50 border-green-200">
        <h3 className="font-medium text-green-900 mb-2">Direct Booking</h3>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Complete your booking details below</li>
          <li>• You'll be taken directly to checkout after confirming</li>
          <li>• Your booking will be saved and you can modify it later if needed</li>
          <li>• All prices include applicable taxes and fees</li>
          {hasAnyPrefill && (
            <li className="font-medium">• Some details have been pre-filled from your previous selections</li>
          )}
        </ul>
      </Card>
    </div>
  );
}
