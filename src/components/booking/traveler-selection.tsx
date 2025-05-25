"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface TravelerCounts {
  adults: number;
  children: number;
  infants: number;
}

export default function TravelerSelection() {
  const [travelers, setTravelers] = useState<TravelerCounts>({
    adults: 2,
    children: 0,
    infants: 0,
  });

  const updateCount = (type: keyof TravelerCounts, increment: boolean) => {
    setTravelers((prev) => {
      const newCount = increment ? prev[type] + 1 : prev[type] - 1;

      // Enforce minimum of 2 adults
      if (type === "adults" && newCount < 2) {
        return prev;
      }

      // Prevent negative counts
      if (newCount < 0) {
        return prev;
      }

      return {
        ...prev,
        [type]: newCount,
      };
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

      <div className="pt-4 ">
        <p className="text-sm text-gray-600 text-right">
          Total travelers:{" "}
          {travelers.adults + travelers.children + travelers.infants}
        </p>
      </div>
    </div>
  );
}
