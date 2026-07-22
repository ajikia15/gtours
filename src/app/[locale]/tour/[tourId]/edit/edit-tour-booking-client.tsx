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
import { useTranslations } from "next-intl";

interface EditTourBookingClientProps {
  tour: Tour;
}

export default function EditTourBookingClient({
  tour,
}: EditTourBookingClientProps) {
  const router = useRouter();
  const t = useTranslations("Booking");

  // Use shared booking logic hook
  const {
    selectedActivities,
    totalPrice,
    bookingState,
    getTravelersDisplay,
    getActivitiesDisplay,
    getTotalPeopleCount,
    // getPayingPeopleCount,
    handleDateChange,
    handleTravelersChange,
    handleActivitiesChange,
    selectedDate,
    travelers,
    booking,
    validateForBookNow,
    // pricingBreakdown,
  } = useTourBooking({ tour });

  const handleBack = () => {
    router.push(`/tour/${tour.id}`);
  };

  const handleProceedToCheckout = async () => {
    const validation = validateForBookNow();
    if (!validation.isComplete) {
      toast.error(t("completeAllRequiredFields"));
      return;
    }

    // Use booking context to proceed directly to checkout
    const result = await booking.proceedToDirectCheckoutWithDetails(tour, {
      selectedDate: selectedDate!,
      travelers,
      selectedActivities,
    });

    if (result.success && result.checkoutUrl) {
      toast.success(t("proceedingToCheckout"));
      router.push(result.checkoutUrl);
    } else {
      toast.error(result.message || t("failedToCheckout"));
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("backToTour")}
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{t("confirmYourBooking")}</h1>
          <p className="text-gray-600">
            {t("reviewAndComplete", { tourName: tour.title[0] })}
          </p>
        </div>
      </div>

      {/* Tour Summary */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Badge variant="secondary">{t("readyToBook")}</Badge>
            <div>
              <h3 className="font-semibold text-lg">{tour.title[0]}</h3>
              <p className="text-gray-600">
                {t("basePricePerPerson", { price: tour.basePrice })} •{" "}
                {tour.duration} {t("days")}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-red-600">
              {totalPrice} GEL
            </div>
            <div className="text-sm text-gray-500">
              {t("totalForTravelers", { count: getTotalPeopleCount() })}
            </div>
          </div>
        </div>
      </Card>

      {/* Booking Details Form */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Date Selection */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">{t("travelDate")}</h3>
            {!bookingState.hasDate && (
              <Badge variant="destructive" className="text-xs">
                {t("required")}
              </Badge>
            )}
          </div>
          <TourDatePicker date={selectedDate} setDate={handleDateChange} />
        </Card>

        {/* Traveler Selection */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">{t("travelers")}</h3>
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
          <h3 className="font-semibold">{t("activities")}</h3>
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
            {t("noAdditionalActivities")}
          </p>
        )}
      </Card>

      {/* Pricing Breakdown */}
      {/* <Card className="p-6 bg-gray-50">
        <h3 className="font-semibold mb-4">Pricing Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Base price</span>
            <span>{pricingBreakdown.basePrice} GEL</span>
          </div>
          {pricingBreakdown.carCost > 0 && (
            <div className="flex justify-between">
              <span>Additional Car</span>
              <span>+{pricingBreakdown.carCost} GEL</span>
            </div>
          )}
          {pricingBreakdown.activityCost > 0 && (
            <div className="flex justify-between">
              <span>Activities ({selectedActivities.length})</span>
              <span>+{pricingBreakdown.activityCost} GEL</span>
            </div>
          )}
          <hr className="my-2" />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span className="text-red-600">
              {pricingBreakdown.totalPrice} GEL
            </span>
          </div>
        </div>
      </Card> */}

      {/* Validation Errors */}
      {!bookingState.isComplete && bookingState.errors.length > 0 && (
        <Card className="p-4 bg-red-50 border-red-200">
          <h4 className="font-medium text-red-800 mb-2">
            {t("pleaseCompleteFollowing")}
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
          {t("backToTour")}
        </Button>
        <Button
          onClick={handleProceedToCheckout}
          disabled={!bookingState.isComplete}
          className="flex-1 bg-red-600 hover:bg-red-700"
        >
          {bookingState.isComplete
            ? t("proceedToCheckout")
            : t("completeRequiredFieldsButton")}
        </Button>
      </div>

      {/* Help Text */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-900 mb-2">
              {t("bookingConfirmation")}
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• {t("helpReviewDetails")}</li>
              <li>• {t("helpConfirmedAfterPayment")}</li>
              <li>• {t("helpModifyUntilPayment")}</li>
              <li>• {t("helpPricesIncludeTaxes")}</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
