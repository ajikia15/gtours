import { getTours } from "@/data/tours";
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
import TourStatusBadge from "@/components/tour-status-badge";
import { getTranslations } from "next-intl/server";
import { getLocalizedTitle } from "@/lib/localizationHelpers";

export default async function ToursTable({
  page = 1,
  params,
}: {
  page?: number;
  params: Promise<{ locale: string }>;
}) {
  // Properly await params
  const { locale } = await params;
  const t = await getTranslations("Admin");

  const { data, totalPages } = await getTours({
    pagination: {
      page,
      pageSize: 10,
    },
  });
  return (
    <>
      {!data?.length && (
        <div className="flex items-center justify-center h-full">
          <p className="text-sm text-muted-foreground">
            {t("dashboard.noToursFound")}
          </p>
        </div>
      )}
      {data?.length && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("table.title")}</TableHead>
              <TableHead>{t("table.location")}</TableHead>
              <TableHead>{t("table.duration")}</TableHead>
              <TableHead>{t("table.price")}</TableHead>
              <TableHead>{t("table.status")}</TableHead>
              <TableHead>{t("table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((tour) => (
              <TableRow key={tour.id}>
                <TableCell>{getLocalizedTitle(tour, locale)}</TableCell>
                <TableCell>
                  {tour.coordinates
                    ? `${tour.coordinates[0]}, ${tour.coordinates[1]}`
                    : t("table.noCoordinates")}
                </TableCell>
                <TableCell>
                  {tour.duration} {t("table.days")}
                </TableCell>
                <TableCell>{tour.basePrice}</TableCell>
                <TableCell>
                  <TourStatusBadge status={tour.status} />
                </TableCell>
                <TableCell className="flex items-center gap-1">
                  <Link href={`/tour/${tour.id}`}>
                    <Button variant="outline" title={t("table.view")}>
                      <Eye />
                    </Button>
                  </Link>
                  <Link href={`/admin/tours/edit/${tour.id}`}>
                    <Button variant="outline" title={t("table.edit")}>
                      <Pencil />
                    </Button>
                  </Link>

                  <Button variant="outline" title={t("table.delete")}>
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
                        href={`/${locale}/admin?page=${
                          page > 1 ? page - 1 : 1
                        }`}
                        aria-disabled={page <= 1}
                        className={
                          page <= 1 ? "pointer-events-none opacity-50" : ""
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href={`/${locale}/admin?page=${i + 1}`}
                          isActive={page === i + 1}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href={`/${locale}/admin?page=${
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
