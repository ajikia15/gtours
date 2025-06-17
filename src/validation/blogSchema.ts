import { z } from "zod";

export const blogStatusEnum = z.enum(["published", "draft", "archived"]);
export type BlogStatus = z.infer<typeof blogStatusEnum>;

export const blogDataSchema = z.object({
  title: z
    .array(z.string().min(1, "Title is required"))
    .length(3, "Title must have 3 language versions [EN, GE, RU]"),
  description: z
    .array(z.string().min(1, "Description is required"))
    .length(3, "Description must have 3 language versions [EN, GE, RU]"),
  author: z.string().min(1, "Author is required"),
  publishedDate: z.coerce.date(),
  categories: z.array(z.string().min(1, "Category cannot be empty")),
  featuredImage: z.string().optional(),
  status: blogStatusEnum.default("draft").optional(),
  seoMeta: z
    .object({
      metaDescription: z
        .array(z.string())
        .length(
          3,
          "Meta description must have 3 language versions [EN, GE, RU]"
        )
        .optional(),
      keywords: z.array(z.string()).optional(),
    })
    .optional(),
});

export const blogImageSchema = z.object({
  images: z.array(
    z.object({
      id: z.string(),
      url: z.string(),
      file: z.instanceof(File).optional(),
    })
  ),
});

// Combine all schemas using .and()
export const blogSchema = blogDataSchema.and(blogImageSchema);
