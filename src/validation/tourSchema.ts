import { z } from "zod";

export const tourStatusEnum = z.enum(["active", "disabled", "draft"]);
export type TourStatus = z.infer<typeof tourStatusEnum>;

// Coordinates schema for [latitude, longitude] tuple
export const coordinatesSchema = z.tuple([
  z.coerce.number().min(-90).max(90), // latitude
  z.coerce.number().min(-180).max(180), // longitude
]);
export type Coordinates = z.infer<typeof coordinatesSchema>;

export const offeredActivitySchema = z.object({
  activityTypeId: z.string().min(1, "Activity Type ID is required"),
  nameSnapshot: z.string().min(1, "Activity name snapshot is required"),
  priceIncrement: z.coerce.number().min(0),
  coordinates: coordinatesSchema,
  specificDescription: z
    .array(z.string().min(1, "Specific description is required"))
    .length(
      3,
      "Specific description must have 3 language versions [EN, GE, RU]"
    ),
});

export const tourDataSchema = z.object({
  title: z
    .array(z.string().min(1, "Title is required"))
    .length(3, "Title must have 3 language versions [EN, GE, RU]"),
  subtitle: z
    .array(z.string().min(1, "Subtitle is required"))
    .length(3, "Subtitle must have 3 language versions [EN, GE, RU]"),
  description: z
    .array(z.string().min(1, "Description is required"))
    .length(3, "Description must have 3 language versions [EN, GE, RU]"),
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
  coordinates: coordinatesSchema.optional(), // Main coordinates for tour area
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
