import { Coordinates } from "@/validation/tourSchema";

export type OfferedActivity = {
  activityTypeId: string; // Reference to activity constant ID
  nameSnapshot: string; // Denormalized name from activity constant (e.g., "Skiing") for easy display
  priceIncrement: number; // Price difference for this activity on this tour
  coordinates: Coordinates; // Specific coordinates for this activity's pin on the map
  specificDescription: string; // Required description for this activity as part of this specific tour
};
