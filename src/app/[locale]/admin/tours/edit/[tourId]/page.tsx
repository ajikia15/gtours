import { Breadcrumbs } from "@/components/ui/breadcrumb";
import EditTourForm from "./edit-tour-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTourById } from "@/data/tours";
import { getLocalizedTitle } from "@/lib/localizationHelpers";
import { getLocale } from "next-intl/server";
export default async function EditTour({
  params,
}: {
  params: Promise<{ tourId: string }>;
}) {
  const { tourId } = await params;
  const tour = await getTourById(tourId);
  const locale = await getLocale();
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
          <CardTitle>Edit Tour - {getLocalizedTitle(tour, locale)}</CardTitle>
        </CardHeader>
        <CardContent>          <EditTourForm
            id={tour.id}
            title={tour.title}
            subtitle={tour.subtitle}
            description={tour.description}
            basePrice={tour.basePrice}
            duration={tour.duration}
            leaveTime={tour.leaveTime}
            returnTime={tour.returnTime}
            coordinates={tour.coordinates}
            status={tour.status}
            images={tour.images || []}
            offeredActivities={tour.offeredActivities || []}
          />
        </CardContent>
      </Card>
    </div>
  );
}
