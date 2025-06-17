import { Tour } from "@/types/Tour";
import { Blog } from "@/types/Blog";
import { OfferedActivity } from "@/types/Activity";

// Language indices for the arrays
const LANGUAGE_INDEX = {
  en: 0,
  ge: 1,
  ru: 2,
} as const;

// Generic title getter that works for both Tour and Blog
export function getLocalizedTitle(item: Tour | Blog, locale: string): string {
  const index =
    LANGUAGE_INDEX[locale as keyof typeof LANGUAGE_INDEX] ?? LANGUAGE_INDEX.en;
  return item.title[index] || item.title[LANGUAGE_INDEX.en] || "";
}

// Tour-specific functions
export function getLocalizedSubtitle(tour: Tour, locale: string): string {
  const index =
    LANGUAGE_INDEX[locale as keyof typeof LANGUAGE_INDEX] ?? LANGUAGE_INDEX.en;
  return tour.subtitle[index] || tour.subtitle[LANGUAGE_INDEX.en] || "";
}

export function getLocalizedDescription(
  item: Tour | Blog,
  locale: string
): string {
  const index =
    LANGUAGE_INDEX[locale as keyof typeof LANGUAGE_INDEX] ?? LANGUAGE_INDEX.en;
  return item.description[index] || item.description[LANGUAGE_INDEX.en] || "";
}

// Blog-specific functions
export function getLocalizedBlogContent(blog: Blog, locale: string): string {
  const index =
    LANGUAGE_INDEX[locale as keyof typeof LANGUAGE_INDEX] ?? LANGUAGE_INDEX.en;
  return blog.content[index] || blog.content[LANGUAGE_INDEX.en] || "";
}

export function getLocalizedBlogMetaDescription(
  blog: Blog,
  locale: string
): string {
  const index =
    LANGUAGE_INDEX[locale as keyof typeof LANGUAGE_INDEX] ?? LANGUAGE_INDEX.en;
  return (
    blog.seoMeta?.metaDescription?.[index] ||
    blog.seoMeta?.metaDescription?.[LANGUAGE_INDEX.en] ||
    ""
  );
}

export function getLocalizedActivityDescription(
  activity: OfferedActivity,
  locale: string
): string {
  const index =
    LANGUAGE_INDEX[locale as keyof typeof LANGUAGE_INDEX] ?? LANGUAGE_INDEX.en;
  return (
    activity.specificDescription[index] ||
    activity.specificDescription[LANGUAGE_INDEX.en] ||
    ""
  );
}
