import { getRatings } from "@/data/ratings";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  TableFooter,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Link } from "@/i18n/navigation";
import { Eye, Pencil, Trash } from "lucide-react";
import { getTranslations } from "next-intl/server";
import RatingStatusBadge from "@/components/rating-status-badge";

export default async function RatingsTable({
  page = 1,
  params = { locale: "en" },
}: {
  page?: number;
  params?: Promise<{ locale: string }> | { locale: string };
}) {
  // Ensure params is awaited
  const resolvedParams = await Promise.resolve(params);
  const locale = resolvedParams.locale;

  // Start both operations in parallel
  const [translationsResult, ratingsResult] = await Promise.all([
    getTranslations("Admin"),
    getRatings({
      pagination: {
        page,
        pageSize: 10,
      },
    }),
  ]);

  const t = translationsResult;
  const { data, totalPages } = ratingsResult;

  // Helper function to get localized title
  const getLocalizedRatingTitle = (rating: any, locale: string) => {
    const langIndex = locale === "en" ? 0 : locale === "ge" ? 1 : 2;
    return rating.title[langIndex] || rating.title[0] || "Untitled";
  };

  return (
    <>
      {!data?.length && (
        <div className="flex items-center justify-center h-full">
          <p className="text-sm text-muted-foreground">
            {t("dashboard.noRatingsFound")}
          </p>
        </div>
      )}
      {data?.length && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("ratingTable.title")}</TableHead>
              <TableHead>{t("ratingTable.author")}</TableHead>
              <TableHead>{t("ratingTable.rating")}</TableHead>
              <TableHead>{t("ratingTable.createdDate")}</TableHead>
              <TableHead>{t("ratingTable.status")}</TableHead>
              <TableHead>{t("ratingTable.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((rating) => (
              <TableRow key={rating.id}>
                <TableCell>{getLocalizedRatingTitle(rating, locale)}</TableCell>
                <TableCell>{rating.author}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span>{rating.rating}</span>
                    <span className="text-yellow-400">★</span>
                  </div>
                </TableCell>
                <TableCell>
                  {rating.createdDate.toLocaleDateString(locale === "ge" ? "ka-GE" : locale === "ru" ? "ru-RU" : "en-US")}
                </TableCell>
                <TableCell>
                  <RatingStatusBadge status={rating.status} />
                </TableCell>
                <TableCell className="flex items-center gap-1">
                  <Link href={`/admin/ratings/${rating.id}`}>
                    <Button variant="outline" title={t("ratingTable.view")}>
                      <Eye />
                    </Button>
                  </Link>
                  <Link href={`/admin/ratings/edit/${rating.id}`}>
                    <Button variant="outline" title={t("ratingTable.edit")}>
                      <Pencil />
                    </Button>
                  </Link>
                  <Button variant="outline" title={t("ratingTable.delete")}>
                    <Trash />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href={`/${locale}/admin/ratings?page=${
                          page > 1 ? page - 1 : 1
                        }`}
                        aria-disabled={page <= 1}
                        className={
                          page <= 1 ? "pointer-events-none opacity-50" : ""
                        }
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <PaginationItem key={i + 1}>
                        <PaginationLink
                          href={`/${locale}/admin/ratings?page=${i + 1}`}
                          isActive={page === i + 1}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href={`/${locale}/admin/ratings?page=${
                          page < totalPages ? page + 1 : totalPages
                        }`}
                        aria-disabled={page >= totalPages}
                        className={
                          page >= totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </>
  );
}
