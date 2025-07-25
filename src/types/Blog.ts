import { BlogStatus } from "@/validation/blogSchema";

export type Blog = {
  id: string;
  title: string[]; // [EN, GE, RU]
  description: string[]; // [EN, GE, RU] - excerpt/summary
  author: string;
  publishedDate: Date;
  categories: string[];
  featuredImage?: string;
  images?: string[];
  status: BlogStatus; // "published" | "draft" | "archived"
  seoMeta?: {
    metaDescription: string[]; // [EN, GE, RU]
    keywords: string[];
  };
};
