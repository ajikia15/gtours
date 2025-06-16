import { Suspense } from "react";
import EditTourContent from "./edit-tour-content";
import EditTourSkeleton from "./edit-tour-skeleton";

export default async function EditTour({
  params,
}: {
  params: Promise<{ tourId: string }>;
}) {
  const { tourId } = await params;

  return (
    <Suspense fallback={<EditTourSkeleton />}>
      <EditTourContent tourId={tourId} />
    </Suspense>
  );
}
