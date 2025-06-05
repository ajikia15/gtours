import Image from "next/image";
import { getImageUrl } from "@/lib/imageHelpers";

export default async function MobileImageSection({
  images,
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
    <div className="w-full min-h-[40vh] relative">
      <Image
        src={images && images.length > 0 ? getImageUrl(images[0]) : mainImage}
        alt={tourTitle}
        fill
        className="object-cover "
      />
      <div className="absolute bottom-0 inset-x-0 bg-white h-6 rounded-t-4xl  z-10" />
    </div>
  );
}
