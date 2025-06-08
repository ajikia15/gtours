import { getTours } from "@/data/tours";
import DirectBookingPageClient from "./direct-booking-page-client";
import { notFound } from "next/navigation";

interface DirectBookingPageProps {
  params: Promise<{ tourId: string }>;
}

export default async function DirectBookingPage({
  params,
}: DirectBookingPageProps) {
  // Fetch tours from server
  const { data: tours } = await getTours({
    pagination: { page: 1, pageSize: 50 },
  });

  // Get the tour ID
  const { tourId } = await params;

  // Find the specific tour
  const tour = tours.find((t) => t.id === tourId);

  if (!tour) {
    notFound();
  }

  return <DirectBookingPageClient tours={tours} tour={tour} />;
}
