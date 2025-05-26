"use client";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

export default function TourDatePicker({
  date,
  setDate,
}: {
  date: Date;
  setDate: (date: Date) => void;
}) {
  const defaultMonth = new Date();
  defaultMonth.setDate(defaultMonth.getDate() + 1);

  return (
    <div>
      <Calendar
        mode="single"
        selected={date}
        onSelect={(day) => setDate(day as Date)}
        initialFocus
        defaultMonth={defaultMonth}
        disabled={(date) =>
          date <= new Date(new Date().setHours(23, 59, 59, 999))
        }
      />
    </div>
  );
}
