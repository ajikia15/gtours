"use client";

import { OfferedActivity } from "@/types/Activity";
import { useTranslations } from "next-intl";
import { getActivityIcon } from "@/lib/imageHelpers";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface ActivityDisplayProps {
  activities: OfferedActivity[];
  selectedActivities: Set<string> | string[];
  interactive?: boolean;
  onActivityToggle?: (activityId: string) => void;
  showCount?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function ActivityDisplay({
  activities,
  selectedActivities,
  interactive = false,
  onActivityToggle,
  showCount = true,
  size = "md",
}: ActivityDisplayProps) {
  const quickCategory = useTranslations("QuickCategory");

  // Convert selectedActivities to Set if it's an array
  const selectedSet = Array.isArray(selectedActivities)
    ? new Set(selectedActivities)
    : selectedActivities;

  // Handle case where activities might be undefined or empty
  if (!activities || !Array.isArray(activities) || activities.length === 0) {
    return (
      <div className="space-y-3">
        <div className="text-sm text-gray-400 p-4 border-2 border-dashed border-gray-200 rounded text-center">
          No activities available
        </div>
      </div>
    );
  }

  // Size configurations
  const sizeConfig = {
    sm: {
      pill: "px-2 py-1 text-xs",
      icon: 12,
      gap: "gap-1",
      wrapper: "gap-1",
    },
    md: {
      pill: "px-2.5 py-1.5 text-xs",
      icon: 14,
      gap: "gap-1.5",
      wrapper: "gap-1.5",
    },
    lg: {
      pill: "px-3 py-2 text-sm",
      icon: 16,
      gap: "gap-2",
      wrapper: "gap-2",
    },
  };

  const config = sizeConfig[size];

  const handleActivityClick = (activityId: string) => {
    if (interactive && onActivityToggle) {
      onActivityToggle(activityId);
    }
  };

  return (
    <div className="space-y-3">
      <div className={`flex flex-wrap ${config.wrapper}`}>
        {activities.map((activity) => {
          const isSelected = selectedSet.has(activity.activityTypeId);

          return (
            <TooltipProvider key={activity.activityTypeId}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleActivityClick(activity.activityTypeId)}
                    disabled={!interactive}
                    className={`
                flex items-center ${config.gap} ${
                      config.pill
                    } rounded-full font-medium
                transition-all duration-200 border
                ${
                  interactive
                    ? "hover:scale-105 active:scale-95 cursor-pointer"
                    : "cursor-default"
                }
                ${
                  isSelected
                    ? "bg-gray-900 text-white border-gray-900 shadow-md"
                    : interactive
                    ? "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                    : "bg-gray-100 text-gray-600 border-gray-200"
                }
              `}
                  >
                    {getActivityIcon(
                      activity.activityTypeId,
                      isSelected,
                      config.icon
                    )}
                    <span className="whitespace-nowrap">
                      {quickCategory(activity.activityTypeId)}
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{activity.specificDescription}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>

      {showCount && (
        <div className="pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            <span className="font-semibold">
              {selectedSet.size > 0 ? selectedSet.size : "No"}
            </span>
            {selectedSet.size === 1 ? " activity" : " activities"} selected
          </p>
        </div>
      )}
    </div>
  );
}
