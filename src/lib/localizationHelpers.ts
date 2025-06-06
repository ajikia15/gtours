import { Tour } from "@/types/Tour";
import { OfferedActivity } from "@/types/Activity";

// Language indices for the arrays
const LANGUAGE_INDEX = {
  en: 0,
  ge: 1,
  ru: 2,
} as const;

export function getLocalizedTitle(tour: Tour, locale: string): string {
  const index =
    LANGUAGE_INDEX[locale as keyof typeof LANGUAGE_INDEX] ?? LANGUAGE_INDEX.en;
  return tour.title[index] || tour.title[LANGUAGE_INDEX.en] || "";
}

export function getLocalizedSubtitle(tour: Tour, locale: string): string {
  const index =
    LANGUAGE_INDEX[locale as keyof typeof LANGUAGE_INDEX] ?? LANGUAGE_INDEX.en;
  return tour.subtitle[index] || tour.subtitle[LANGUAGE_INDEX.en] || "";
}

export function getLocalizedDescription(tour: Tour, locale: string): string {
  const index =
    LANGUAGE_INDEX[locale as keyof typeof LANGUAGE_INDEX] ?? LANGUAGE_INDEX.en;
  return tour.description[index] || tour.description[LANGUAGE_INDEX.en] || "";
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
