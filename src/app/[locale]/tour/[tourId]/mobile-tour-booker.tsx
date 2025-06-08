"use client";
import { useState } from "react";
import { Tour } from "@/types/Tour";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Calendar, Users, Activity } from "lucide-react";
import { useTourBooking } from "@/hooks/use-tour-booking";
import { useCartChanges } from "@/hooks/use-cart-changes";
import TourActionButton from "@/components/tour-action-button";
import TourDatePicker from "@/components/booking/tour-date-picker";
import TravelerSelection from "@/components/booking/traveler-selection";
import ActivitySelection from "@/components/booking/activity-selection";

export default function MobileTourBooker({ tour }: { tour: Tour }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Use shared booking logic hook
  const {
    selectedActivities,
    totalPrice,
    bookingState,
    getDateDisplay,
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
    validateForAddToCart,
  } = useTourBooking({ tour });

  // Change detection hook (for update detection)
  const { initialState, resetInitialState } = useCartChanges({
    selectedDate,
    travelers,
    selectedActivities,
  });

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        <div className="z-50 flex flex-col items-center justify-center w-full px-4 pb-4 pt-3 bg-white fixed bottom-0 inset-x-0 mb-20 border-t border border-gray-200 rounded-t-lg shadow-lg">
          <div className="flex justify-center">
            <div className="h-2 rounded-full bg-gray-300 w-24"></div>
          </div>
          <div className="flex items-center justify-between w-full pt-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {totalPrice} GEL
              </h1>
              <div className="flex flex-row text-gray-600 text-sm">
                <span>{getDateDisplay()}</span>
                <span className="mx-2">|</span>
                <span>{getTravelersDisplay()}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TourActionButton
                tour={tour}
                selectedActivities={selectedActivities}
                variant="outline"
                size="default"
                className="font-medium"
                showIcon={false}
                text={true}
                intent="secondary"
                detectChanges={true}
                initialState={initialState}
                onUpdateSuccess={resetInitialState}
                validateForAddToCart={validateForAddToCart}
              />
            </div>
          </div>
        </div>
      </DrawerTrigger>
      
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="pb-4">
          <DrawerTitle className="text-xl font-bold">
            Complete Your Booking
          </DrawerTitle>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {tour.title[0]}
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Base: {tour.basePrice} GEL</span>
                <Badge variant="outline">{tour.duration} days</Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-600">
                {totalPrice} GEL
              </div>
              <div className="text-xs text-gray-500">
                Total for {getTotalPeopleCount()} travelers
              </div>
            </div>
          </div>
        </DrawerHeader>

        <div className="px-4 pb-4 space-y-4 overflow-y-auto">
          {/* Date Selection */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-600" />
                <h3 className="font-medium">Travel Date</h3>
              </div>
              {!bookingState.hasDate && (
                <Badge variant="destructive" className="text-xs">
                  Required
                </Badge>
              )}
            </div>
            <TourDatePicker
              date={selectedDate}
              setDate={handleDateChange}
            />
          </Card>

          {/* Traveler Selection */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-600" />
                <h3 className="font-medium">Travelers</h3>
              </div>
              <div className="text-sm text-gray-600">
                {getTravelersDisplay()}
              </div>
            </div>
            <TravelerSelection
              travelers={travelers}
              setTravelers={handleTravelersChange}
            />
          </Card>

          {/* Activity Selection */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-gray-600" />
                <h3 className="font-medium">Activities</h3>
              </div>
              <div className="text-sm text-gray-600">
                {getActivitiesDisplay()}
              </div>
            </div>
            {tour.offeredActivities && tour.offeredActivities.length > 0 ? (
              <ActivitySelection
                activities={tour.offeredActivities}
                selectedActivities={new Set(selectedActivities)}
                setSelectedActivities={(activities) =>
                  handleActivitiesChange(Array.from(activities))
                }
                onSelectionChange={handleActivitiesChange}
                disableTooltips={true}
              />
            ) : (
              <p className="text-sm text-gray-500 italic">
                No additional activities available for this tour.
              </p>
            )}
          </Card>

          {/* Pricing Breakdown */}
          <Card className="p-4 bg-gray-50">
            <h3 className="font-medium mb-2">Pricing Summary</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Base price ({getPayingPeopleCount()} paying travelers)</span>
                <span>{tour.basePrice * getPayingPeopleCount()} GEL</span>
              </div>
              {selectedActivities.length > 0 && (
                <div className="flex justify-between">
                  <span>Activities ({selectedActivities.length})</span>
                  <span>+{booking.calculateActivityPriceIncrement(tour, selectedActivities)} GEL</span>
                </div>
              )}
              <hr className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{totalPrice} GEL</span>
              </div>
            </div>
          </Card>

          {/* Validation Errors - Only show for primary intent (Book Now) */}
          {!bookingState.isComplete && bookingState.errors.length > 0 && (
            <Card className="p-4 bg-red-50 border-red-200">
              <h4 className="font-medium text-red-800 mb-2">
                Please complete the following to book now:
              </h4>
              <ul className="text-sm text-red-700 space-y-1">
                {bookingState.errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        <DrawerFooter className="pt-4">
          <TourActionButton
            tour={tour}
            selectedActivities={selectedActivities}
            variant="brandred"
            size="lg"
            className="w-full font-bold"
            text={true}
            showIcon={true}
            intent="primary"
            validateForBookNow={validateForBookNow}
          />
          <TourActionButton
            tour={tour}
            selectedActivities={selectedActivities}
            variant="outline"
            size="lg"
            className="w-full"
            text={true}
            showIcon={false}
            intent="secondary"
            detectChanges={true}
            initialState={initialState}
            onUpdateSuccess={resetInitialState}
            validateForAddToCart={validateForAddToCart}
          />
          <DrawerClose asChild>
            <Button variant="ghost" size="lg" className="w-full">
              Continue Browsing
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
