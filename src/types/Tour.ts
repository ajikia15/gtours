import { TourStatus } from "@/validation/tourSchema";
export type Tour = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  basePrice: number;
  duration: number;
  leaveTime: string;
  returnTime: string;
  location: string;
  status: TourStatus;
};

export type TourWithId = Tour & { id: string };
