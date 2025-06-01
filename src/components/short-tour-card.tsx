"use server";
import { Tour } from "@/types/Tour";
import Image from "next/image";
import { getImageUrl } from "@/lib/imageHelpers";
import { Link } from "@/i18n/navigation";
import ReactMarkdown from "react-markdown";
// import ToggleFavouriteButton from "@/components/toggle-favourite-button";
import { getLocale } from "next-intl/server";
import { MapPinIcon, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
export default async function ShortTourCard({ tour }: { tour: Tour }) {
  return (
    <div className="flex flex-col h-full border border-gray-300 shadow-sm rounded-xl">
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
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold">{tour.title}</h3>
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <MapPinIcon size={14} /> {tour.title}, საკარტველოუ
            </div>
          </div>
          <p className="text-sm font-bold text-primary-foreground">
            ₾{tour.basePrice}
          </p>
        </div>

        {/* <Link
          href={`/tour/${tour.id}`}
          className="w-fit font-bold hover:underline"
        >
          View Tour
        </Link> */}
        <div className="flex gap-2">
          <Button>Book Now</Button>
          <Button
            className="w-full"
            variant="outline"
            // onClick={handleCartAction}
            // disabled={isAddingToCart}
          >
            <ShoppingCart className="size-4 " />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
