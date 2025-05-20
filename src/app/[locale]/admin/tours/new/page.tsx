import { Breadcrumbs } from "@/components/ui/breadcrumb";
import NewTourForm from "./new-tour-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTours } from "@/data/tours";

export default async function NewTour() {
  const tours = await getTours({});
  return (
    <div className="max-w-xl mx-auto mt-5">
      <Breadcrumbs
        items={[
          { label: "Admin Dashboard", href: "/admin" },
          { label: "Tours" },
          { label: "New Tour" },
        ]}
      />

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>New Tour</CardTitle>
        </CardHeader>
        <CardContent>
          <NewTourForm />
        </CardContent>
      </Card>
    </div>
  );
}
