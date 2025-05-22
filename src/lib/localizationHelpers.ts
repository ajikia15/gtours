import { Tour } from "@/types/Tour";

export function getLocalizedDescription(tour: Tour, locale: string): string {
  switch (locale) {
    case "en":
      return tour.descriptionEN;
    case "ge":
      return tour.descriptionGE;
    case "ru":
      return tour.descriptionRU;
    default:
      return tour.descriptionEN; // Default to English if locale is not supported
  }
}
