import { z } from "zod";

export const ratingStatusEnum = z.enum(["active", "inactive", "draft"]);
export type RatingStatus = z.infer<typeof ratingStatusEnum>;

export const ratingSchema = z.object({
  title: z
    .array(z.string().min(1, "Title is required"))
    .length(3, "Title must have 3 language versions [EN, GE, RU]"),
  review: z
    .array(z.string().min(1, "Review is required"))
    .length(3, "Review must have 3 language versions [EN, GE, RU]"),
  author: z.string().min(1, "Author is required"),
  rating: z.coerce.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  createdDate: z.coerce.date(),
  status: ratingStatusEnum.default("draft").optional(),
  tourId: z.string().optional(),
});
