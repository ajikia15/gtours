import { getTourById } from "@/data/tours";
import { notFound } from "next/navigation";
import EditTourBookingClient from "@/app/[locale]/tour/[tourId]/edit/edit-tour-booking-client";

interface EditTourBookingPageProps {
  params: Promise<{ tourId: string }>;
}

export default async function EditTourBookingPage({
  params,
}: EditTourBookingPageProps) {
  const { tourId } = await params;

  try {
    const tour = await getTourById(tourId);
    return <EditTourBookingClient tour={tour} />;
  } catch (error) {
    console.error("Failed to fetch tour:", error);
    notFound();
  }
}
