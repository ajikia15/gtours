// Option 1: Compact Toggle Pills/Chips
"use client";
import { OfferedActivity } from "@/types/Activity";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { getActivityIcon } from "@/lib/imageHelpers";

interface ActivitySelectionProps {
  activities: OfferedActivity[];
  onSelectionChange?: (selectedIds: string[]) => void;
}

export default function ActivitySelection({
  activities,
  onSelectionChange,
}: ActivitySelectionProps) {
  const quickCategory = useTranslations("QuickCategory");
  const [selectedActivities, setSelectedActivities] = useState<Set<string>>(
    new Set()
  );

  const handleActivityToggle = (activityId: string) => {
    setSelectedActivities((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(activityId)) {
        newSet.delete(activityId);
      } else {
        newSet.add(activityId);
      }

      // Call the callback with the new selection
      onSelectionChange?.(Array.from(newSet));

      return newSet;
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {activities.map((activity) => (
          <button
            key={activity.activityTypeId}
            onClick={() => handleActivityToggle(activity.activityTypeId)}
            className={`
              flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium
              transition-all duration-200 border hover:scale-105 active:scale-95
              ${
                selectedActivities.has(activity.activityTypeId)
                  ? "bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-200"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
              }
            `}
          >
            {getActivityIcon(
              activity.activityTypeId,
              selectedActivities.has(activity.activityTypeId),
              14
            )}
            <span className="whitespace-nowrap">
              {quickCategory(activity.activityTypeId)}
            </span>
          </button>
        ))}
      </div>

      <div className="py-2 border-t border-gray-200">
        <p className="text-xs text-gray-600">
          <span className="font-semibold">
            {selectedActivities.size > 0 ? selectedActivities.size : "No"}
          </span>
          {selectedActivities.size === 1 ? " activity" : " activities"} selected
        </p>
      </div>
    </div>
  );
}
