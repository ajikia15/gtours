import { Breadcrumbs } from "@/components/ui/breadcrumb";
import EditTourForm from "./edit-tour-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTourById } from "@/../firebase/tours";
export default async function EditTour({
  params,
}: {
  params: Promise<{ tourId: string }>;
}) {
  const { tourId } = await params;
  const tour = await getTourById(tourId);
  return (
    <div className="max-w-xl mx-auto mt-5">
      <Breadcrumbs
        items={[
          { label: "Admin Dashboard", href: "/admin" },
          { label: "Tours" },
          { label: "Edit Tour" },
        ]}
      />

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Edit Tour - {tour.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <EditTourForm
            id={tour.id}
            title={tour.title}
            description={tour.description}
            imageUrl={tour.imageUrl}
            basePrice={tour.basePrice}
            duration={tour.duration}
            leaveTime={tour.leaveTime}
            returnTime={tour.returnTime}
            location={tour.location}
            status={tour.status}
          />
        </CardContent>
      </Card>
    </div>
  );
}
