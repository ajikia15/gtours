import { getAllBookings } from "@/data/bookings";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { SortableHeader } from "./components/sortable-header";
import { BookingStatusSelect } from "./components/booking-status-select";
import { format } from "date-fns";

import { DeleteBookingButton } from "./components/delete-booking-button";

import { BookingDetailsDialog } from "./components/booking-details-dialog";
import { BookingStatusFilter } from "./components/booking-status-filter";

export default async function BookingsTable({
  page = 1,
  sort,
  order,
  status,
}: {
  page?: number;
  sort?: "date" | "amount";
  order?: "asc" | "desc";
  status?: "pending" | "confirmed" | "completed" | "cancelled";
}) {
  // const t = await getTranslations("Admin");

  const result = await getAllBookings({
    pagination: { page, pageSize: 10 },
    sorting: { sortBy: sort, sortOrder: order },
    filters: { status },
  });

  // Handle error case
  if ("error" in result && result.error) {
    return (
      <div className="flex items-center justify-center h-full p-4 text-destructive">
        <p>Error: {result.error}</p>
      </div>
    );
  }

  const { data, totalPages } = result;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <BookingStatusFilter />
      </div>

      {!data?.length && (
        <div className="flex items-center justify-center h-32 border rounded-md bg-muted/10">
          <p className="text-sm text-muted-foreground">No bookings found</p>
        </div>
      )}
      {data?.length && (
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>
                  <SortableHeader title="Date" value="date" />
                </TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>
                  <SortableHeader title="Amount" value="amount" />
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">
                    {booking.invoiceNumber}
                  </TableCell>
                  <TableCell>
                    {booking.createdAt
                      ? format(
                          booking.createdAt instanceof Date
                            ? booking.createdAt
                            : new Date(booking.createdAt),
                          "PPP"
                        )
                      : booking.invoiceDate}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{booking.customer.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {booking.customer.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {booking.summary.currency} {booking.summary.totalPrice}
                  </TableCell>
                  <TableCell>
                    <BookingStatusSelect
                      bookingId={booking.id}
                      currentStatus={booking.status || "completed"}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <BookingDetailsDialog booking={booking} />
                      <DeleteBookingButton bookingId={booking.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                {page > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      href={`?page=${page - 1}${sort ? `&sort=${sort}` : ""}${
                        order ? `&order=${order}` : ""
                      }${status ? `&status=${status}` : ""}`}
                    />
                  </PaginationItem>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <PaginationItem key={p}>
                      <PaginationLink
                        href={`?page=${p}${sort ? `&sort=${sort}` : ""}${
                          order ? `&order=${order}` : ""
                        }${status ? `&status=${status}` : ""}`}
                        isActive={page === p}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                {page < totalPages && (
                  <PaginationItem>
                    <PaginationNext
                      href={`?page=${page + 1}${sort ? `&sort=${sort}` : ""}${
                        order ? `&order=${order}` : ""
                      }${status ? `&status=${status}` : ""}`}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </div>
  );
}
