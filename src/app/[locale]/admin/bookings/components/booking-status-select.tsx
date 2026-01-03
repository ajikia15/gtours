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
import { useTranslations } from "next-intl";

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
  const t = useTranslations("Admin.bookingStatus");

  const handleValueChange = async (value: string) => {
    const newStatus = value as any;
    setStatus(newStatus);
    setIsLoading(true);

    const result = await updateBookingStatus(bookingId, newStatus);

    setIsLoading(false);

    if (!result.success) {
      setStatus(currentStatus); // Revert on error
      toast.error(t("updateError"));
    } else {
      toast.success(t("updateSuccess"));
    }
  };

  return (
    <Select
      value={status}
      onValueChange={handleValueChange}
      disabled={isLoading}
    >
      <SelectTrigger className="w-[130px]">
        <SelectValue placeholder={t("statusPlaceholder")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">{t("pending")}</SelectItem>
        <SelectItem value="confirmed">{t("confirmed")}</SelectItem>
        <SelectItem value="completed">{t("completed")}</SelectItem>
        <SelectItem value="cancelled">{t("cancelled")}</SelectItem>
      </SelectContent>
    </Select>
  );
}
