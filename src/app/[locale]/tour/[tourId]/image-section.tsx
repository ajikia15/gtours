import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getImageUrl } from "@/lib/imageHelpers";

export default async function ImageSection({
  images,
  tourId,
  tourTitle,
}: {
  images: string[] | undefined;
  tourId: string;
  tourTitle: string;
}) {
  const mainImage = getImageUrl(
    images && images.length > 0 ? images[0] : undefined
  );
  return (
    <div className="grid grid-cols-4 gap-4 w-full my-10">
      <div className="flex flex-col gap-4 aspect-[1/2]">
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-2xl">{tourTitle}</h1>
          <div className="flex flex-row gap-2 text-lg">
            <div className="w-4 bg-black my-1.5"></div>
            <div>
              <h1>Explore</h1>
              <h1 className="font-bold">{tourTitle}&apos;s</h1>
              <h1>Wonders</h1>
            </div>
          </div>
        </div>
        <div className="relative w-full flex-1 rounded-xl overflow-hidden shadow-md">
          <Image
            src={
              images && images.length > 0 ? getImageUrl(images[0]) : mainImage
            }
            alt={tourTitle}
            fill
            className="object-cover rounded-xl"
          />
        </div>
      </div>

      {/* Column 2: 2 Images */}
      <div className="flex flex-col gap-4 aspect-[1/2]">
        <div className="relative w-full flex-1 rounded-xl overflow-hidden shadow-md">
          <Image
            src={
              images && images.length > 0 ? getImageUrl(images[1]) : mainImage
            }
            alt={tourTitle}
            fill
            className="object-cover rounded-xl"
          />
        </div>
        <div className="relative w-full flex-1 rounded-xl overflow-hidden shadow-md">
          <Image
            src={
              images && images.length > 0 ? getImageUrl(images[2]) : mainImage
            }
            alt={tourTitle}
            fill
            className="object-cover rounded-xl"
          />
        </div>
      </div>

      {/* Column 3: 2 Images */}
      <div className="flex flex-col gap-4 aspect-[1/2]">
        <div className="relative w-full grow-[3] rounded-xl overflow-hidden shadow-md">
          <Image
            src={
              images && images.length > 0 ? getImageUrl(images[3]) : mainImage
            }
            alt={tourTitle}
            fill
            className="object-cover rounded-xl"
          />
        </div>
        <div className="relative w-full grow-[2] rounded-xl overflow-hidden shadow-md">
          <Image
            src={
              images && images.length > 0 ? getImageUrl(images[4]) : mainImage
            }
            alt={tourTitle}
            fill
            className="object-cover rounded-xl"
          />
        </div>
      </div>

      {/* Column 4: 2 Images */}
      <div className="flex flex-col gap-4 aspect-[1/2]">
        <div className="relative w-full grow-[4] rounded-xl overflow-hidden shadow-md">
          <Image
            src={
              images && images.length > 0 ? getImageUrl(images[5]) : mainImage
            }
            alt={tourTitle}
            fill
            className="object-cover rounded-xl"
          />
        </div>
        <Link
          href={`/tour/${tourId}/gallery`}
          className="relative w-full grow rounded-xl overflow-hidden cursor-pointer group shadow-md"
        >
          <Image
            src={
              images && images.length > 0 ? getImageUrl(images[6]) : mainImage
            }
            alt={tourTitle}
            fill
            className="object-cover rounded-xl transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gray-300/75 hover:bg-gray-300/90 flex items-center justify-center rounded-xl transition-colors duration-300 ease-in-out">
            <span className="text-black font-bold text-lg">View More</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
