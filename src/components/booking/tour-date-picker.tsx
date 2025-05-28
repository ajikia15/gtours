"use client";
import { Calendar } from "@/components/ui/calendar";

export default function TourDatePicker({
  date,
  setDate,
}: {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}) {
  const defaultMonth = new Date();
  defaultMonth.setDate(defaultMonth.getDate() + 1);

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={(day) => setDate(day)}
      initialFocus
      defaultMonth={defaultMonth}
      disabled={(date) =>
        date <= new Date(new Date().setHours(23, 59, 59, 999))
      }
    />
  );
}
