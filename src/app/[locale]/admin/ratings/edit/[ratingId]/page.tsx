import { Breadcrumbs } from "@/components/ui/breadcrumb";
import EditRatingForm from "./edit-rating-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRatingById } from "@/data/ratings";
import { getTranslations } from "next-intl/server";

export default async function EditRating({
  params,
}: {
  params: Promise<{ ratingId: string }>;
}) {
  const resolvedParams = await params;
  const t = await getTranslations("Admin");

  const rating = await getRatingById(resolvedParams.ratingId);

  if (!rating) {
    return (
      <div className="max-w-4xl mx-auto mt-5">
        <p>Rating not found</p>
      </div>
    );
  }

  // Helper function to get localized title
  const getLocalizedRatingTitle = (rating: any) => {
    return rating.title[0] || rating.title[1] || rating.title[2] || "Untitled";
  };

  return (
    <div className="max-w-4xl mx-auto mt-5">
      <Breadcrumbs
        items={[
          { label: t("breadcrumbs.adminDashboard"), href: "/admin" },
          { label: t("breadcrumbs.ratings") },
          { label: t("breadcrumbs.editRating") },
          { label: getLocalizedRatingTitle(rating) },
        ]}
      />

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>{t("ratingForm.editRating")}</CardTitle>
        </CardHeader>
        <CardContent>
          <EditRatingForm {...rating} />
        </CardContent>
      </Card>
    </div>
  );
}
