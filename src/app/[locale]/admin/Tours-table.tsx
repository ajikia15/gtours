import { getTours } from "@/../firebase/tours";
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
import Link from "next/link";

export default async function ToursTable({ page = 1 }: { page?: number }) {
  const { data, totalPages } = await getTours({
    pagination: {
      page,
      pageSize: 2,
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
        <Table className="mt-5">
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((tour) => (
              <TableRow key={tour.id}>
                <TableCell>{tour.title}</TableCell>
                <TableCell>{tour.location}</TableCell>
                <TableCell>{tour.duration} Days</TableCell>
                <TableCell>{tour.basePrice}</TableCell>
                <TableCell>
                  <Button>Edit</Button>
                  <Button>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5} className="flex items-center justify-end">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href={`/en/admin?page=${page > 1 ? page - 1 : 1}`}
                        aria-disabled={page <= 1}
                        className={
                          page <= 1 ? "pointer-events-none opacity-50" : ""
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href={`/en/admin?page=${i + 1}`}
                          isActive={page === i + 1}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href={`/en/admin?page=${
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
