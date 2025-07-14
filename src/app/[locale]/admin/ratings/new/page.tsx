import { Breadcrumbs } from "@/components/ui/breadcrumb";
import NewRatingForm from "./new-rating-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

export default async function NewRating() {
  const t = await getTranslations("Admin");

  return (
    <div className="max-w-4xl mx-auto mt-5">
      <Breadcrumbs
        items={[
          { label: t("breadcrumbs.adminDashboard"), href: "/admin" },
          { label: t("breadcrumbs.ratings") },
          { label: t("breadcrumbs.newRating") },
        ]}
      />

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>{t("ratingForm.newRating")}</CardTitle>
        </CardHeader>
        <CardContent>
          <NewRatingForm />
        </CardContent>
      </Card>
    </div>
  );
}
