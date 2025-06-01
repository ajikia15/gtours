"use client";
import { Tour } from "@/types/Tour";
import Image from "next/image";
import { getImageUrl } from "@/lib/imageHelpers";
import { Link } from "@/i18n/navigation";
import { getLocalizedDescription } from "@/lib/localizationHelpers";
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
  const locale = useLocale();

  return (
    <div className="flex flex-col h-full mr-10 border border-gray-300 shadow-xs rounded-xl">
      <Link
        href={`/tour/${tour.id}`}
        className="aspect-square w-full relative cursor-pointer"
      >
        {/* <ToggleFavouriteButton tourId={tour.id} isFavourite={isFavourite} /> */}
        {tour.images && (
          <Image
            src={getImageUrl(tour.images[0])}
            alt={tour.title}
            fill
            className="w-full h-full object-cover rounded-lg"
          />
        )}
      </Link>
      <div className="flex flex-col gap-2 p-6">
        <h3 className="text-lg font-bold">{tour.title}</h3>
        <div className="text-sm text-gray-500 line-clamp-3 mr-10">
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
