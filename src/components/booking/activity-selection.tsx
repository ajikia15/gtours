"use client";
import { OfferedActivity } from "@/types/Activity";
import ActivityDisplay from "@/components/activity-display";

interface ActivitySelectionProps {
  activities: OfferedActivity[];
  selectedActivities: Set<string>;
  setSelectedActivities: (selectedActivities: Set<string>) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  disableTooltips?: boolean;
}

export default function ActivitySelection({
  activities,
  selectedActivities,
  setSelectedActivities,
  onSelectionChange,
  disableTooltips = false,
}: ActivitySelectionProps) {
  const handleActivityToggle = (activityId: string) => {
    const newSet = new Set(selectedActivities);
    if (newSet.has(activityId)) {
      newSet.delete(activityId);
    } else {
      newSet.add(activityId);
    }

    setSelectedActivities(newSet);

    // Call the callback with the new selection
    onSelectionChange?.(Array.from(newSet));
  };

  return (
    <ActivityDisplay
      activities={activities}
      selectedActivities={selectedActivities}
      interactive={true}
      onActivityToggle={handleActivityToggle}
      showCount={true}
      size="md"
      disableTooltips={disableTooltips}
    />
  );
}
