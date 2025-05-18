import { z } from "zod";

export const tourDataSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(1, "Price is required"),
  image: z.string().min(1, "Image is required"),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  location: z.string().optional(),
  status: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});
