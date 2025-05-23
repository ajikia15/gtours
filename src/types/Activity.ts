export type ActivityType = {
  id: string; // Document ID in a new 'activity_master' Firebase collection
  name: string; // Standardized name, e.g., "Skiing", "Horse Riding"
  genericDescription?: string;
  icon?: string; // URL or identifier for an icon
};

export type OfferedActivity = {
  activityTypeId: string; // Reference to ActivityType.id
  nameSnapshot: string; // Denormalized name from ActivityType (e.g., "Skiing") for easy display and in case the master name changes
  priceIncrement: number; // Price difference for this activity on this tour
  latitude: number; // Specific latitude for this activity's pin on the map
  longitude: number; // Specific longitude for this activity's pin on the map
  specificDescription?: string; // Optional description for this activity as part of this specific tour
};
