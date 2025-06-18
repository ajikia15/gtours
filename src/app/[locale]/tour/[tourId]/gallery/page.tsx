import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTourById } from "@/data/tours";
import GalleryContent from "./gallery-content";
import GallerySkeleton from "./gallery-skeleton";

type Props = {
  params: Promise<{
    tourId: string;
    locale: string;
  }>;
};

export default async function GalleryPage({ params }: Props) {
  const { tourId } = await params;

  try {
    const tour = await getTourById(tourId);

    if (!tour) {
      notFound();
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Photo Gallery
          </h1>
          <p className="text-xl text-gray-600">{tour.title[0]}</p>
          <p className="text-gray-500 mt-1">
            Discover the stunning landscapes and memorable moments from this
            amazing tour
          </p>
        </div>

        <Suspense fallback={<GallerySkeleton />}>
          <GalleryContent tour={tour} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error("Error loading tour:", error);
    notFound();
  }
}
