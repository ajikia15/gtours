import ImageSectionMember from "./image-section-member";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

export default function ImageSection({
  images,
  tourId,
}: {
  images: string[] | undefined;
  tourId: string;
}) {
  const getImageUrl = (image?: string) =>
    image
      ? `https://firebasestorage.googleapis.com/v0/b/gtours-fcd56.firebasestorage.app/o/${encodeURIComponent(
          image
        )}?alt=media`
      : "/HorseRiding.svg";
  const mainImage = getImageUrl(
    images && images.length > 0 ? images[0] : undefined
  );
  return (
    <div className="grid grid-cols-4 gap-4 w-full my-10">
      <div className="flex flex-col gap-4 aspect-[1/2]">
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-2xl">Tbilisi</h1>
          <div className="flex flex-row gap-2 text-lg">
            <div className="w-4 bg-black my-1.5"></div>
            <div>
              <h1>Explore</h1>
              <h1 className="font-bold">Tbilisi's</h1>
              <h1>Wonders</h1>
            </div>
          </div>
        </div>
        <div className="relative w-full flex-1 rounded-xl overflow-hidden">
          <Image
            src={mainImage}
            alt={mainImage}
            fill
            className="object-cover rounded-xl"
          />
        </div>
      </div>

      {/* Column 2: 2 Images */}
      <div className="flex flex-col gap-4 aspect-[1/2]">
        <div className="relative w-full flex-1 rounded-xl overflow-hidden">
          <Image
            src={mainImage}
            alt={mainImage}
            fill
            className="object-cover rounded-xl"
          />
        </div>
        <div className="relative w-full flex-1 rounded-xl overflow-hidden">
          <Image
            src={mainImage}
            alt={mainImage}
            fill
            className="object-cover rounded-xl"
          />
        </div>
      </div>

      {/* Column 3: 2 Images */}
      <div className="flex flex-col gap-4 aspect-[1/2]">
        <div className="relative w-full grow-[3] rounded-xl overflow-hidden">
          <Image
            src={mainImage}
            alt={mainImage}
            fill
            className="object-cover rounded-xl"
          />
        </div>
        <div className="relative w-full grow-[2] rounded-xl overflow-hidden">
          <Image
            src={mainImage}
            alt={mainImage}
            fill
            className="object-cover rounded-xl"
          />
        </div>
      </div>

      {/* Column 4: 2 Images */}
      <div className="flex flex-col gap-4 aspect-[1/2]">
        <div className="relative w-full grow-[4] rounded-xl overflow-hidden">
          <Image
            src={mainImage}
            alt={mainImage}
            fill
            className="object-cover rounded-xl"
          />
        </div>
        <Link
          href={`/tour/${tourId}/gallery`}
          className="relative w-full grow rounded-xl overflow-hidden cursor-pointer group"
        >
          <Image
            src={mainImage}
            alt={mainImage}
            fill
            className="object-cover rounded-xl transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gray-800/75 hover:bg-gray-800/90 flex items-center justify-center rounded-xl transition-colors duration-300 ease-in-out">
            <span className="text-white font-bold text-lg">View More</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
