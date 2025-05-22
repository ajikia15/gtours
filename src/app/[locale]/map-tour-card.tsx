import { Tour } from "@/types/Tour";
import Image from "next/image";
import { getImageUrl } from "@/lib/imageHelpers";
export default function MapTourCard({ tour }: { tour: Tour }) {
  return (
    <div className="flex flex-col gap-2">
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
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">{tour.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-3">
          {tour.descriptionEN}
        </p>
      </div>
    </div>
  );
}
