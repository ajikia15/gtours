"use client";

import { useTranslations } from "next-intl";
import { getActivityIcon } from "@/lib/imageHelpers";

interface CartActivityDisplayProps {
  selectedActivities: string[];
}

export default function CartActivityDisplay({
  selectedActivities,
}: CartActivityDisplayProps) {
  const quickCategory = useTranslations("QuickCategory");

  if (!selectedActivities || selectedActivities.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {selectedActivities.map((activityId) => (
          <div
            key={activityId}
            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200"
          >
            {getActivityIcon(activityId, false, 12)}
            <span className="whitespace-nowrap">
              {quickCategory(activityId)}
            </span>
          </div>
        ))}
      </div>
      <div className="text-xs text-gray-500">
        {selectedActivities.length} activit
        {selectedActivities.length !== 1 ? "ies" : "y"} selected
      </div>
    </div>
  );
}
