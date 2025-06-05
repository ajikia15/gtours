"use server";
import { Tour } from "@/types/Tour";
import Image from "next/image";
import { getImageUrl } from "@/lib/imageHelpers";
import { Link } from "@/i18n/navigation";
// import ToggleFavouriteButton from "@/components/toggle-favourite-button";
import { MapPinIcon } from "lucide-react";
import BookNowButton from "./book-now-button";
import AddToCartButton from "./add-to-cart-button";

export default async function ShortTourCard({ tour }: { tour: Tour }) {
  return (
    <div className="flex flex-col h-full border border-gray-300 shadow-xs rounded-xl">
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
      <div className="flex flex-col gap-2 px-4 py-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">{tour.title}</h3>
          <p className=" font-bold text-brand-secondary">₾{tour.basePrice}</p>
        </div>
        <div className="text-sm text-gray-500 flex items-center gap-1">
          <MapPinIcon size={14} /> {tour.title}, საკარტველოუ
        </div>
        {/* <Link
          href={`/tour/${tour.id}`}
          className="w-fit font-bold hover:underline"
        >
          View Tour
        </Link> */}{" "}
        <div className="flex gap-2 mt-2 mb-2">
          <BookNowButton tour={tour} />
          <AddToCartButton tour={tour} variant="ghost" text={false} />
        </div>
      </div>
    </div>
  );
}
