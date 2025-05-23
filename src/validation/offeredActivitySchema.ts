import { z } from "zod";

export const offeredActivitySchema = z.object({
  activityTypeId: z.string().min(1, "Activity Type ID is required"),
  nameSnapshot: z.string().min(1, "Activity name snapshot is required"),
  priceIncrement: z.coerce.number().default(0),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  specificDescription: z.string().optional(),
});
