import { z } from "zod";

export const activityTypeSchema = z.object({
  name: z.string().min(1, "Activity name is required"),
  genericDescription: z.string().optional(),
  icon: z.string().url("Icon must be a valid URL").optional().or(z.literal("")),
});
