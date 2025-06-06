import { TourStatus, Coordinates } from "@/validation/tourSchema";
import { OfferedActivity } from "./Activity";

export type Tour = {
  id: string;
  title: string[]; // [EN, GE, RU]
  subtitle: string[]; // [EN, GE, RU]
  description: string[]; // [EN, GE, RU]
  basePrice: number;
  duration: number;
  leaveTime: string;
  returnTime: string;
  coordinates?: Coordinates;
  status: TourStatus;
  images?: string[];
  offeredActivities: OfferedActivity[];
};

// export type TourWithId = Tour & { id: string };
