import { activityTypes } from "@/data/activity-constants";

import Image from "next/image";
import { Activity } from "lucide-react";
import { ReactElement } from "react";

export const getImageUrl = (image?: string) =>
  image
    ? `https://firebasestorage.googleapis.com/v0/b/gtours-fcd56.firebasestorage.app/o/${encodeURIComponent(
        image
      )}?alt=media`
    : "/horse-rider.png";

export const getActivityIcon = (
  activityTypeId: string,
  filter = true,
  size = 16
): ReactElement => {
  const activityType = activityTypes.find((at) => at.id === activityTypeId);

  if (activityType) {
    return (
      <Image
        src={`/${activityType.iconFileName}`}
        alt={activityType.name}
        width={size}
        height={size}
        style={{
          filter: filter ? "brightness(0) invert(1)" : "none",
        }}
      />
    );
  }

  // Fallback to Activity icon for unknown types
  return <Activity size={16} />;
};
