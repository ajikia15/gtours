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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Link } from "@/i18n/navigation";
import { Eye, Pencil, Trash } from "lucide-react";
import TourStatusBadge from "@/components/tour-status-badge";

export default async function ToursTable({
  page = 1,
  params = { locale: "en" },
}: {
  page?: number;
  params?: Promise<{ locale: string }> | { locale: string };
}) {
  // Ensure params is awaited
  const resolvedParams = await Promise.resolve(params);
  const locale = resolvedParams.locale;

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
          <p className="text-sm text-muted-foreground">No tours found</p>
        </div>
      )}
      {data?.length && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((tour) => (
              <TableRow key={tour.id}>
                <TableCell>{tour.title}</TableCell>
                <TableCell>
                  {tour.lat}, {tour.long}
                </TableCell>
                <TableCell>{tour.duration} Days</TableCell>
                <TableCell>{tour.basePrice}</TableCell>
                <TableCell>
                  <TourStatusBadge status={tour.status} />
                </TableCell>
                <TableCell className="flex items-center gap-1">
                  <Link href={`/tour/${tour.id}`}>
                    <Button variant="outline">
                      <Eye />
                    </Button>
                  </Link>
                  <Link href={`/admin/tours/edit/${tour.id}`}>
                    <Button variant="outline">
                      <Pencil />
                    </Button>
                  </Link>

                  <Button variant="outline">
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
