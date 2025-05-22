import { Tour } from "@/types/Tour";
import Image from "next/image";
import { getImageUrl } from "@/lib/imageHelpers";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function MapTourCard({ tour }: { tour: Tour }) {
  return (
    <div className="flex flex-col h-full mr-10 border-2 border-gray-300 rounded-xl">
      <div className="aspect-square w-full relative rounded-xl">
        {tour.images && (
          <Image
            src={getImageUrl(tour.images[0])}
            alt={tour.title}
            fill
            className="w-full h-full object-cover rounded-xl"
          />
        )}
      </div>
      <div className="flex flex-col gap-2 p-6">
        <h3 className="text-lg font-bold">{tour.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-3 mr-10">
          {tour.descriptionEN}
        </p>
        <Link
          href={`/tours/${tour.id}`}
          className="w-fit font-bold hover:underline"
        >
          View Tour
        </Link>
      </div>
    </div>
  );
}
