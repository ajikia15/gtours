export type ActivityType = {
  id: string; // Document ID in a new 'activity_master' Firebase collection, also used for translations
  name: string; // Display name, e.g., "Skiing", "Horse Riding"
  pngFileName:
    | "camping"
    | "hot-air-balloon"
    | "parachute"
    | "ski"
    | "water-rafting"
    | "zip-lining"
    | "snowmobile"
    | "horse-rider"; // PNG filename without .png extension
  genericDescription?: string;
  isActive: boolean; // Whether this activity type is available for selection
};

export type OfferedActivity = {
  activityTypeId: string; // Reference to ActivityType.id
  nameSnapshot: string; // Denormalized name from ActivityType (e.g., "Skiing") for easy display and in case the master name changes
  priceIncrement: number; // Price difference for this activity on this tour
  latitude: number; // Specific latitude for this activity's pin on the map
  longitude: number; // Specific longitude for this activity's pin on the map
  specificDescription: string; // Required description for this activity as part of this specific tour
};
