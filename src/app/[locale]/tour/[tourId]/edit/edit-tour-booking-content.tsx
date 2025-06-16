import { getTourById } from "@/data/tours";
import { notFound } from "next/navigation";
import EditTourBookingClient from "@/app/[locale]/tour/[tourId]/edit/edit-tour-booking-client";

interface EditTourBookingContentProps {
  tourId: string;
}

export default async function EditTourBookingContent({
  tourId,
}: EditTourBookingContentProps) {
  try {
    const tour = await getTourById(tourId);
    return <EditTourBookingClient tour={tour} />;
  } catch (error) {
    console.error("Failed to fetch tour:", error);
    notFound();
  }
}
