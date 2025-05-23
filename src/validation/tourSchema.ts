import { z } from "zod";

export const tourStatusEnum = z.enum(["active", "disabled", "draft"]);
export type TourStatus = z.infer<typeof tourStatusEnum>;

export const offeredActivitySchema = z.object({
  activityTypeId: z.string().min(1, "Activity Type ID is required"),
  nameSnapshot: z.string().min(1, "Activity name snapshot is required"),
  priceIncrement: z.coerce.number().min(0),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  specificDescription: z.string().optional(),
});

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
});

// Separate schema for activities - better separation of concerns
export const tourActivitiesSchema = z.object({
  offeredActivities: z.array(offeredActivitySchema),
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

// Combine all schemas using .and()
export const tourSchema = tourDataSchema
  .and(tourActivitiesSchema)
  .and(tourImageSchema);
