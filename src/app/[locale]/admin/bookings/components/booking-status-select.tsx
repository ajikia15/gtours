"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateBookingStatus } from "@/data/bookings";
import { useState } from "react";
import { toast } from "sonner";

interface BookingStatusSelectProps {
  bookingId: string;
  currentStatus: "pending" | "confirmed" | "completed" | "cancelled";
}

export function BookingStatusSelect({
  bookingId,
  currentStatus,
}: BookingStatusSelectProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleValueChange = async (value: string) => {
    const newStatus = value as any;
    setStatus(newStatus);
    setIsLoading(true);

    const result = await updateBookingStatus(bookingId, newStatus);

    setIsLoading(false);

    if (!result.success) {
      setStatus(currentStatus); // Revert on error
      toast.error("Failed to update status");
    } else {
      toast.success("Status updated");
    }
  };

  return (
    <Select
      value={status}
      onValueChange={handleValueChange}
      disabled={isLoading}
    >
      <SelectTrigger className="w-[130px]">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="confirmed">Confirmed</SelectItem>
        <SelectItem value="completed">Completed</SelectItem>
        <SelectItem value="cancelled">Cancelled</SelectItem>
      </SelectContent>
    </Select>
  );
}
