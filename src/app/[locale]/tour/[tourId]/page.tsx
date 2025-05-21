"use server";
import ImageSectionSkeleton from "./image-section-skeleton";
import { getTourById } from "@/data/tours";
import { Suspense } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import ImageSection from "./image-section";
export default async function TourPage({
  params,
}: {
  params: Promise<{ tourId: string }>;
}) {
  const { tourId } = await params;
  const tour = await getTourById(tourId);

  return (
    <div>
      <Suspense fallback={<ImageSectionSkeleton />}>
        <ImageSection images={tour.images} tourId={tourId} />
      </Suspense>
      <h1 className="text-2xl font-bold">About the Tour</h1>
      <div className="tour-description">
        <ReactMarkdown>{tour.description}</ReactMarkdown>
      </div>
    </div>
  );
}
