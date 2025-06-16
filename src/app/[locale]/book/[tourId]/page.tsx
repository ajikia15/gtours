import { Suspense } from "react";
import DirectBookingContent from "./direct-booking-content";
import DirectBookingSkeleton from "./direct-booking-skeleton";

interface DirectBookingPageProps {
  params: Promise<{ tourId: string }>;
}

export default async function DirectBookingPage({
  params,
}: DirectBookingPageProps) {
  const { tourId } = await params;

  return (
    <Suspense fallback={<DirectBookingSkeleton />}>
      <DirectBookingContent tourId={tourId} />
    </Suspense>
  );
}
