import { Breadcrumbs } from "@/components/ui/breadcrumb";
import EditActivityTypeForm from "./edit-activity-type-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getActivityTypeById } from "@/data/activities";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

export default async function EditActivityTypePage({
  params,
}: {
  params: { activityTypeId: string; locale: string };
}) {
  const { activityTypeId, locale } = params;
  const t = await getTranslations("AdminEditActivityTypePage");

  const activityType = await getActivityTypeById(activityTypeId);

  if (!activityType) {
    notFound();
  }

  return (
    <div className="max-w-xl mx-auto mt-5">
      <Breadcrumbs
        items={[
          { label: t("breadcrumbs.adminDashboard"), href: `/${locale}/admin` },
          {
            label: t("breadcrumbs.activities"),
            href: `/${locale}/admin/activities`,
          },
          { label: t("breadcrumbs.editActivityType") },
        ]}
      />

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>
            {t("title")} - {activityType.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EditActivityTypeForm activityType={activityType} />
        </CardContent>
      </Card>
    </div>
  );
}
