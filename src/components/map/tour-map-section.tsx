"use client";

import dynamic from "next/dynamic";
import { OfferedActivity } from "@/types/Activity";
import { Coordinates } from "@/validation/tourSchema";

interface TourMapSectionProps {
  tourCoordinates?: Coordinates;
  activities: OfferedActivity[];
  tourTitle: string;
}

// Dynamic import with no SSR to prevent window errors
const TourMapComponent = dynamic(() => import("./tour-map-component"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl flex items-center justify-center shadow-lg">
      <div className="flex items-center gap-3 text-blue-600">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="text-sm font-medium">Loading map...</span>
      </div>
    </div>
  ),
});

export default function TourMapSection(props: TourMapSectionProps) {
  return <TourMapComponent {...props} />;
}
