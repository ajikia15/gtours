import { TourStatus } from "@/validation/tourSchema";
export type Tour = {
  id: string;
  title: string;
  descriptionEN: string;
  descriptionGE: string;
  descriptionRU: string;
  basePrice: number;
  duration: number;
  leaveTime: string;
  returnTime: string;
  lat: number;
  long: number;
  status: TourStatus;
  images?: string[];
};

// export type TourWithId = Tour & { id: string };
