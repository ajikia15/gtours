// Activity types constants - these match the available PNG icons
export const activityTypes = [
  {
    id: "hot-air-balloon",
    name: "Hot Air Balloon",
    iconFileName: "hot-air-balloon.svg" as const,
  },
  {
    id: "parasailing",
    name: "Parasailing",
    iconFileName: "parasailing.png" as const,
  },
  {
    id: "paragliding",
    name: "Paragliding",
    iconFileName: "paragliding.png" as const,
  },
  {
    id: "river-rafting",
    name: "River Rafting",
    iconFileName: "river-rafting.svg" as const,
  },
  {
    id: "zipline",
    name: "Zipline",
    iconFileName: "zipline.svg" as const,
  },
  {
    id: "karting",
    name: "Karting",
    iconFileName: "karting.png" as const,
  },
  {
    id: "skiing",
    name: "Skiing",
    iconFileName: "skiing.svg" as const,
  },
  {
    id: "snowmobile-ride",
    name: "Snowmobile Ride",
    iconFileName: "snowmobile-ride.svg" as const,
  },
  {
    id: "horse-ride",
    name: "Horse Ride",
    iconFileName: "horse-ride.svg" as const,
  },
  {
    id: "boat-ride",
    name: "Boat Ride",
    iconFileName: "boat_ride.png" as const,
  },
  {
    id: "motorboat-ride",
    name: "Motorboat Ride",
    iconFileName: "motorboat_ride.png" as const,
  },
  {
    id: "helicopter-ride",
    name: "Helicopter Ride",
    iconFileName: "helicopter.png" as const,
  },
  {
    id: "georgian-food-tasting",
    name: "Georgian Food Tasting",
    iconFileName: "georgian-food-tasting.png" as const,
  },
  {
    id: "wine-tasting",
    name: "Wine Tasting",
    iconFileName: "wine-tasting.png" as const,
  },
  {
    id: "georgian-cooking-masterclass",
    name: "Georgian Cooking Masterclass",
    iconFileName: "georgian-cooking-masterclass.png" as const,
  },
] as const;

export type ActivityTypeConstant = (typeof activityTypes)[number];
