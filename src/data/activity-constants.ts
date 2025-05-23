// Activity types constants - these match the available PNG icons
export const ACTIVITY_TYPES = [
  {
    id: "camping",
    name: "Camping",
    pngFileName: "camping" as const,
  },
  {
    id: "hot-air-balloon",
    name: "Hot Air Balloon",
    pngFileName: "hot-air-balloon" as const,
  },
  {
    id: "parachute",
    name: "Parachute",
    pngFileName: "parachute" as const,
  },
  {
    id: "ski",
    name: "Skiing",
    pngFileName: "ski" as const,
  },
  {
    id: "water-rafting",
    name: "Water Rafting",
    pngFileName: "water-rafting" as const,
  },
  {
    id: "zip-lining",
    name: "Zip Lining",
    pngFileName: "zip-lining" as const,
  },
  {
    id: "snowmobile",
    name: "Snowmobile",
    pngFileName: "snowmobile" as const,
  },
  {
    id: "horse-rider",
    name: "Horse Riding",
    pngFileName: "horse-rider" as const,
  },
] as const;

export type ActivityTypeConstant = (typeof ACTIVITY_TYPES)[number];
