import { z } from "zod";

export const tourStatusEnum = z.enum(["active", "disabled", "draft"]);
export type TourStatus = z.infer<typeof tourStatusEnum>;

import { offeredActivitySchema } from "./offeredActivitySchema";
export const tourDataSchema = z.object({
  title: z.string().min(1, "Title is required"),
  descriptionEN: z.string().min(1, "English Description is required"),
  descriptionGE: z.string().min(1, "Georgian Description is required"),
  descriptionRU: z.string().min(1, "Russian Description is required"),
  basePrice: z.coerce.number().min(1, "Base price is required"),
  duration: z.coerce
    .number()
    .int()
    .min(1, "Tour duration must be at least 1 day")
    .optional()
    .or(z.literal("")),
  leaveTime: z
    .string()
    .regex(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Leave time must be in HH:MM format"
    )
    .optional(),
  returnTime: z
    .string()
    .regex(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Return time must be in HH:MM format"
    )
    .optional(),
  lat: z.coerce.number().optional(), // Main lat for tour area
  long: z.coerce.number().optional(), // Main long for tour area
  status: tourStatusEnum.default("draft").optional(),
  offeredActivities: z.array(offeredActivitySchema).optional(), // New field
  activityTypeNames: z.array(z.string()).optional(), // New field
});

export const tourImageSchema = z.object({
  images: z.array(
    z.object({
      id: z.string(),
      url: z.string(),
      file: z.instanceof(File).optional(),
    })
  ),
});

export const tourSchema = tourDataSchema.and(tourImageSchema);
