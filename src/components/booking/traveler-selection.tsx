"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { TravelerCounts } from "@/types/Booking";

export default function TravelerSelection({
  travelers,
  setTravelers,
}: {
  travelers: TravelerCounts;
  setTravelers: (travelers: TravelerCounts) => void;
}) {
  const updateCount = (type: keyof TravelerCounts, increment: boolean) => {
    const newCount = increment ? travelers[type] + 1 : travelers[type] - 1;

    // Enforce minimum of 2 adults
    if (type === "adults" && newCount < 2) {
      return;
    }

    // Prevent negative counts
    if (newCount < 0) {
      return;
    }

    setTravelers({
      ...travelers,
      [type]: newCount,
    });
  };

  const TravelerRow = ({
    title,
    subtitle,
    count,
    type,
  }: {
    title: string;
    subtitle: string;
    count: number;
    type: keyof TravelerCounts;
  }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-200">
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => updateCount(type, false)}
          disabled={type === "adults" && count <= 2}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center font-medium">{count}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => updateCount(type, true)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="space-y-0">
        <TravelerRow
          title="Adults"
          subtitle="12 years and up"
          count={travelers.adults}
          type="adults"
        />

        <TravelerRow
          title="Children"
          subtitle="2 - 12 years old"
          count={travelers.children}
          type="children"
        />

        <TravelerRow
          title="Infants"
          subtitle="0 - 2 years old"
          count={travelers.infants}
          type="infants"
        />
      </div>

      <div className="py-2 border-t border-gray-200">
        <p className="text-xs text-gray-600">
          <span className="font-semibold">
            {travelers.adults + travelers.children + travelers.infants}{" "}
          </span>
          travelers
        </p>
      </div>
    </div>
  );
}
