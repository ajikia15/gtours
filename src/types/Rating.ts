import { RatingStatus } from "@/validation/ratingSchema";

export type { RatingStatus };

export type Rating = {
  id: string;
  title: string[]; // [EN, GE, RU]
  review: string[]; // [EN, GE, RU]
  author: string;
  rating: number; // 1-5
  createdDate: Date;
  status: RatingStatus; // "active" | "inactive" | "draft"
  tourId?: string;
};
