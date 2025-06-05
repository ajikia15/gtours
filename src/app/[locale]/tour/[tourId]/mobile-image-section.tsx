import { MobileImageCarouselWithBars } from "@/components/carousel/MobileImageCarouselWithBars";

export default async function MobileImageSection({
  images,
  tourTitle,
}: {
  images: string[] | undefined;
  tourId: string;
  tourTitle: string;
}) {
  return (
    <MobileImageCarouselWithBars
      images={images}
      tourTitle={tourTitle}
    />
  );
}
