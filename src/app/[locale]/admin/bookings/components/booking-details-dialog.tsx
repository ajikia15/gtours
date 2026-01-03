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

export function BookingDetailsDialog({ booking }: { booking: Booking }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" title="View Details">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
          <DialogDescription>
            Invoice #{booking.invoiceNumber}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-full max-h-[70vh] pr-4">
          <div className="grid gap-6 py-4">
            {/* Customer Information */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg border-b pb-1">
                Customer Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">
                    Name:
                  </span>
                  <p>{booking.customer.name}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">
                    Email:
                  </span>
                  <p>{booking.customer.email}</p>
                </div>
                {booking.customer.phone && (
                  <div>
                    <span className="font-medium text-muted-foreground">
                      Phone:
                    </span>
                    <p>{booking.customer.phone}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Booking Summary */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg border-b pb-1">Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">
                    Total Price:
                  </span>
                  <p className="text-lg font-bold text-primary">
                    {booking.summary.currency} {booking.summary.totalPrice}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">
                    Total Tourists:
                  </span>
                  <p>{booking.summary.tourists}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">
                    Total Tours:
                  </span>
                  <p>{booking.summary.tours}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">
                    Created At:
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
              <h3 className="font-semibold text-lg border-b pb-1">Itinerary</h3>
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
                        Date:
                      </span>
                      <p>{tour.selectedDate}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">
                        Travelers:
                      </span>
                      <p>{tour.travelers}</p>
                    </div>
                  </div>

                  {tour.activities && tour.activities.length > 0 && (
                    <div>
                      <span className="font-medium text-muted-foreground text-sm">
                        Selected Activities:
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
