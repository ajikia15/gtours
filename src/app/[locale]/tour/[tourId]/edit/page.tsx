import { Suspense } from "react";
import EditTourBookingContent from "./edit-tour-booking-content";
import EditTourBookingSkeleton from "./edit-tour-booking-skeleton";

interface EditTourBookingPageProps {
  params: Promise<{ tourId: string }>;
}

export default async function EditTourBookingPage({
  params,
}: EditTourBookingPageProps) {
  const { tourId } = await params;

  return (
    <Suspense fallback={<EditTourBookingSkeleton />}>
      <EditTourBookingContent tourId={tourId} />
    </Suspense>
  );
}
