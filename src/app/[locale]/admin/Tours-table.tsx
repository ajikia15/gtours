import { getTours } from "@/../firebase/tours";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export default async function ToursTable() {
  const { data } = await getTours({
    pagination: {
      page: 1,
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
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      )}
    </>
  );
}
