import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

export default function ToursTableSkeleton() {
  return (
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
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton className="h-4 w-[80px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[80px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[50px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[50px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[70px]" />
            </TableCell>
            <TableCell className="flex items-center gap-1">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
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
                  <Skeleton className="h-8 w-[70px]" />
                </PaginationItem>
                {Array.from({ length: 3 }).map((_, i) => (
                  <PaginationItem key={i}>
                    <Skeleton className="h-8 w-8" />
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <Skeleton className="h-8 w-[70px]" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
