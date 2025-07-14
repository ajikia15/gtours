import { getRatingById } from "@/data/ratings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import RatingStatusBadge from "@/components/rating-status-badge";

export default async function RatingView({
  params,
}: {
  params: Promise<{ ratingId: string }>;
}) {
  const resolvedParams = await params;
  const locale = await getLocale();

  const rating = await getRatingById(resolvedParams.ratingId);

  if (!rating) {
    return (
      <div className="max-w-4xl mx-auto mt-5">
        <p>Rating not found</p>
      </div>
    );
  }

  // Helper function to get localized text
  const getLocalizedText = (textArray: string[], locale: string) => {
    const langIndex = locale === "en" ? 0 : locale === "ge" ? 1 : 2;
    return textArray[langIndex] || textArray[0] || "";
  };

  const localizedTitle = getLocalizedText(rating.title, locale);
  const localizedReview = getLocalizedText(rating.review, locale);

  return (
    <div className="max-w-4xl mx-auto mt-5">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{localizedTitle}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Rating Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Author</label>
              <p className="text-lg">{rating.author}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Rating</label>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{rating.rating}</span>
                <span className="text-2xl text-yellow-400">★</span>
                <span className="text-sm text-gray-500">/ 5</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <div className="mt-1">
                <RatingStatusBadge status={rating.status} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Created Date</label>
              <p>{rating.createdDate.toLocaleDateString()}</p>
            </div>
            {rating.tourId && (
              <div>
                <label className="text-sm font-medium text-gray-600">Tour ID</label>
                <p className="font-mono text-sm">{rating.tourId}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Review Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Title</label>
              <p className="text-lg font-semibold">{localizedTitle}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Review</label>
              <p className="text-gray-700 leading-relaxed">{localizedReview}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex gap-4">
        <Link href={`/admin/ratings/edit/${rating.id}`}>
          <Button>Edit Rating</Button>
        </Link>
        <Link href="/admin">
          <Button variant="outline">Back to Admin</Button>
        </Link>
      </div>
    </div>
  );
}
