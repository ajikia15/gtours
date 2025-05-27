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
      <div className="text-xs text-gray-600 font-medium">
        Selected activities:
      </div>
      <div className="flex flex-wrap gap-1">
        {selectedActivities.map((activityId) => (
          <div
            key={activityId}
            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-900 text-white border border-gray-900"
          >
            {getActivityIcon(activityId, true, 12)}
            <span className="whitespace-nowrap">
              {quickCategory(activityId)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
