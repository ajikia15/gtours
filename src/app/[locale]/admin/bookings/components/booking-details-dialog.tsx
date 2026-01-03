"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Booking } from "@/data/bookings";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslations } from "next-intl";

export function BookingDetailsDialog({ booking }: { booking: Booking }) {
  const t = useTranslations("Admin.bookingDetails");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" title={t("viewDetails")}>
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>
            {t("invoice")} {booking.invoiceNumber}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-full max-h-[70vh] pr-4">
          <div className="grid gap-6 py-4">
            {/* Customer Information */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg border-b pb-1">
                {t("customerInfo")}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">
                    {t("name")}
                  </span>
                  <p>{booking.customer.name}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">
                    {t("email")}
                  </span>
                  <p>{booking.customer.email}</p>
                </div>
                {booking.customer.phone && (
                  <div>
                    <span className="font-medium text-muted-foreground">
                      {t("phone")}
                    </span>
                    <p>{booking.customer.phone}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Booking Summary */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg border-b pb-1">
                {t("summary")}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">
                    {t("totalPrice")}
                  </span>
                  <p className="text-lg font-bold text-primary">
                    {booking.summary.currency} {booking.summary.totalPrice}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">
                    {t("totalTourists")}
                  </span>
                  <p>{booking.summary.tourists}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">
                    {t("totalTours")}
                  </span>
                  <p>{booking.summary.tours}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">
                    {t("createdAt")}
                  </span>
                  <p>
                    {booking.createdAt
                      ? format(
                          booking.createdAt instanceof Date
                            ? booking.createdAt
                            : new Date(booking.createdAt),
                          "PPP p"
                        )
                      : booking.invoiceDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Tour Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-1">
                {t("itinerary")}
              </h3>
              {booking.tourDetails.map((tour, index) => (
                <div
                  key={index}
                  className="bg-muted/30 p-4 rounded-lg border space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-base">
                      {tour.tourTitle}
                    </h4>
                    <span className="font-medium">
                      {booking.summary.currency} {tour.price}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">
                        {t("date")}
                      </span>
                      <p>{tour.selectedDate}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">
                        {t("travelers")}
                      </span>
                      <p>{tour.travelers}</p>
                    </div>
                  </div>

                  {tour.activities && tour.activities.length > 0 && (
                    <div>
                      <span className="font-medium text-muted-foreground text-sm">
                        {t("selectedActivities")}
                      </span>
                      <ul className="list-disc list-inside text-sm mt-1">
                        {tour.activities.map((activity, i) => (
                          <li key={i}>{activity}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
