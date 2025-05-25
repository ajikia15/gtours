"use client";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

export default function TourDatePicker() {
  const [date, setDate] = useState<Date>();

  const defaultMonth = new Date();
  defaultMonth.setDate(defaultMonth.getDate() + 1);

  return (
    <div>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        initialFocus
        defaultMonth={defaultMonth}
        disabled={(date) =>
          date <= new Date(new Date().setHours(23, 59, 59, 999))
        }
      />
    </div>
  );
}
