"use client";

import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Tour } from "@/types/Tour";
import { useTourBooking } from "@/hooks/use-tour-booking";
import TourDatePicker from "@/components/booking/tour-date-picker";
import TravelerSelection from "@/components/booking/traveler-selection";
import ActivitySelection from "@/components/booking/activity-selection";
import { toast } from "sonner";

interface EditTourBookingClientProps {
  tour: Tour;
}

export default function EditTourBookingClient({
  tour,
}: EditTourBookingClientProps) {
  const router = useRouter();

  // Use shared booking logic hook
  const {
    selectedActivities,
    totalPrice,
    bookingState,
    getTravelersDisplay,
    getActivitiesDisplay,
    getTotalPeopleCount,
    getPayingPeopleCount,
    handleDateChange,
    handleTravelersChange,
    handleActivitiesChange,
    selectedDate,
    travelers,
    booking,
    validateForBookNow,
  } = useTourBooking({ tour });

  const handleBack = () => {
    router.push(`/tour/${tour.id}`);
  };

  const handleProceedToCheckout = async () => {
    const validation = validateForBookNow();
    if (!validation.isComplete) {
      toast.error("Please complete all required fields");
      return;
    }

    // Use booking context to proceed directly to checkout
    const result = await booking.proceedToDirectCheckoutWithDetails(tour, {
      selectedDate: selectedDate!,
      travelers,
      selectedActivities,
    });

    if (result.success && result.checkoutUrl) {
      toast.success("Proceeding to checkout...");
      router.push(result.checkoutUrl);
    } else {
      toast.error(result.message || "Failed to proceed to checkout");
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tour
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Confirm Your Booking</h1>
          <p className="text-gray-600">
            Review and complete your booking for {tour.title[0]}
          </p>
        </div>
      </div>

      {/* Tour Summary */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Badge variant="secondary">Ready to Book</Badge>
            <div>
              <h3 className="font-semibold text-lg">{tour.title[0]}</h3>
              <p className="text-gray-600">
                Base price: {tour.basePrice} GEL per person • {tour.duration}{" "}
                days
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-red-600">
              {totalPrice} GEL
            </div>
            <div className="text-sm text-gray-500">
              Total for {getTotalPeopleCount()} travelers
            </div>
          </div>
        </div>
      </Card>

      {/* Booking Details Form */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Date Selection */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Travel Date</h3>
            {!bookingState.hasDate && (
              <Badge variant="destructive" className="text-xs">
                Required
              </Badge>
            )}
          </div>
          <TourDatePicker date={selectedDate} setDate={handleDateChange} />
        </Card>

        {/* Traveler Selection */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Travelers</h3>
            <div className="text-sm text-gray-600">{getTravelersDisplay()}</div>
          </div>
          <TravelerSelection
            travelers={travelers}
            setTravelers={handleTravelersChange}
          />
        </Card>
      </div>

      {/* Activity Selection */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Activities</h3>
          <div className="text-sm text-gray-600">{getActivitiesDisplay()}</div>
        </div>
        {tour.offeredActivities && tour.offeredActivities.length > 0 ? (
          <ActivitySelection
            activities={tour.offeredActivities}
            selectedActivities={new Set(selectedActivities)}
            setSelectedActivities={(activities) =>
              handleActivitiesChange(Array.from(activities))
            }
          />
        ) : (
          <p className="text-sm text-gray-500 italic">
            No additional activities available for this tour.
          </p>
        )}
      </Card>

      {/* Pricing Breakdown */}
      <Card className="p-6 bg-gray-50">
        <h3 className="font-semibold mb-4">Pricing Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Base price ({getPayingPeopleCount()} paying travelers)</span>
            <span>{tour.basePrice * getPayingPeopleCount()} GEL</span>
          </div>
          {selectedActivities.length > 0 && (
            <div className="flex justify-between">
              <span>Activities ({selectedActivities.length})</span>
              <span>
                +
                {booking.calculateActivityPriceIncrement(
                  tour,
                  selectedActivities
                )}{" "}
                GEL
              </span>
            </div>
          )}
          <hr className="my-2" />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span className="text-red-600">{totalPrice} GEL</span>
          </div>
        </div>
      </Card>

      {/* Validation Errors */}
      {!bookingState.isComplete && bookingState.errors.length > 0 && (
        <Card className="p-4 bg-red-50 border-red-200">
          <h4 className="font-medium text-red-800 mb-2">
            Please complete the following to proceed:
          </h4>
          <ul className="text-sm text-red-700 space-y-1">
            {bookingState.errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={handleBack} className="flex-1">
          Back to Tour
        </Button>
        <Button
          onClick={handleProceedToCheckout}
          disabled={!bookingState.isComplete}
          className="flex-1 bg-red-600 hover:bg-red-700"
        >
          {bookingState.isComplete
            ? "Proceed to Checkout"
            : "Complete Required Fields"}
        </Button>
      </div>

      {/* Help Text */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-900 mb-2">
              Booking Confirmation
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Review all details before proceeding to checkout</li>
              <li>• Your booking will be confirmed after payment</li>
              <li>
                • You can modify your booking details until payment is completed
              </li>
              <li>• All prices include applicable taxes and fees</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
