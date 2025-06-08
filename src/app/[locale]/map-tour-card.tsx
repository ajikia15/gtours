"use client";
import { Tour } from "@/types/Tour";
import Image from "next/image";
import { getImageUrl } from "@/lib/imageHelpers";
import { Link } from "@/i18n/navigation";
import {
  getLocalizedTitle,
  getLocalizedDescription,
} from "@/lib/localizationHelpers";
import ReactMarkdown from "react-markdown";
// import ToggleFavouriteButton from "@/components/toggle-favourite-button";
import { useLocale } from "next-intl";

export default function MapTourCard({
  tour,
}: // isFavourite,
{
  tour: Tour;
  // isFavourite: boolean;
}) {
  // const t = await getTranslations("Homepage");
  const locale = useLocale();  return (
    <div className="flex flex-col w-full lg:w-80 xl:w-96 border border-gray-300 shadow-sm rounded-xl bg-white">
      <Link
        href={`/tour/${tour.id}`}
        className="aspect-[4/3] w-full relative cursor-pointer overflow-hidden rounded-t-xl"
      >
        {/* <ToggleFavouriteButton tourId={tour.id} isFavourite={isFavourite} /> */}
        {tour.images && (
          <Image
            src={getImageUrl(tour.images[0])}
            alt={tour.title[0]}
            fill
            className="w-full h-full object-cover rounded-t-xl"
          />
        )}
      </Link>      <div className="flex flex-col gap-3 p-6">
        <h3 className="text-xl font-bold">{getLocalizedTitle(tour, locale)}</h3>
        <div className="text-base text-gray-500 line-clamp-3">
          <ReactMarkdown>{getLocalizedDescription(tour, locale)}</ReactMarkdown>
        </div>
        <Link
          href={`/tour/${tour.id}`}
          className="w-fit font-bold hover:underline"
        >
          View Tour
        </Link>
      </div>
    </div>
  );
}
