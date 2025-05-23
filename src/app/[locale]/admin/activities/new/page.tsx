import { Breadcrumbs } from "@/components/ui/breadcrumb";
import NewActivityTypeForm from "./new-activity-type-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

export default async function NewActivityTypePage() {
  const t = await getTranslations("AdminNewActivityTypePage");

  return (
    <div className="max-w-xl mx-auto mt-5">
      <Breadcrumbs
        items={[
          { label: t("breadcrumbs.adminDashboard"), href: "/admin" },
          { label: t("breadcrumbs.activities"), href: "/admin/activities" },
          { label: t("breadcrumbs.newActivityType") },
        ]}
      />

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <NewActivityTypeForm />
        </CardContent>
      </Card>
    </div>
  );
}
