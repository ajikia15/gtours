import { Breadcrumbs } from "@/components/ui/breadcrumb";
import NewTourForm from "./new-tour-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

export default async function NewTour() {
  const t = await getTranslations("Admin");

  return (
    <div className="max-w-xl mx-auto mt-5">
      <Breadcrumbs
        items={[
          { label: t("breadcrumbs.adminDashboard"), href: "/admin" },
          { label: t("breadcrumbs.tours") },
          { label: t("breadcrumbs.newTour") },
        ]}
      />

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>{t("tourForm.newTour")}</CardTitle>
        </CardHeader>
        <CardContent>
          <NewTourForm />
        </CardContent>
      </Card>
    </div>
  );
}
