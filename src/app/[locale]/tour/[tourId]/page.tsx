"use server";
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
    <div className="p-8">
      <Suspense fallback={<div>Loading...</div>}>
        <ImageSection images={tour.images} />
      </Suspense>
      <ReactMarkdown>{tour.description}</ReactMarkdown>
    </div>
  );
}
