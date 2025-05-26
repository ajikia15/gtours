import { getTours } from "@/data/tours";
import EditBookingPageClient from "./edit-booking-page-client";

interface EditBookingPageProps {
  params: Promise<{ itemId: string }>;
}

export default async function EditBookingPage({
  params,
}: EditBookingPageProps) {
  // Fetch tours from server
  const { data: tours } = await getTours({
    pagination: { page: 1, pageSize: 50 }, // Get more tours for selection
  });

  // Get the item ID
  const { itemId } = await params;

  return <EditBookingPageClient tours={tours} itemId={itemId} />;
}
