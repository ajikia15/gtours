import { z } from "zod";

// List of allowed PNG filenames (without .png extension) for validation
const ALLOWED_PNG_FILES = [
  "camping",
  "hot-air-balloon",
  "parachute",
  "ski",
  "water-rafting",
  "zip-lining",
  "snowmobile",
  "horse-rider",
  // Add more as you create PNG files
] as const;

export const activityTypeSchema = z.object({
  id: z.string().min(1, "Activity ID is required"),
  name: z.string().min(1, "Activity name is required"),
  pngFileName: z.enum(ALLOWED_PNG_FILES, {
    errorMap: () => ({
      message: "Invalid PNG file. Must be one of the allowed activity PNGs.",
    }),
  }),
  genericDescription: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type ActivityType = z.infer<typeof activityTypeSchema>;

// Helper function to get PNG path
export const getActivityPngPath = (pngFileName: string) =>
  `/${pngFileName}.png`;
