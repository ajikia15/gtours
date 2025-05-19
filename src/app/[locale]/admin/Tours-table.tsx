import { getTours } from "@/../firebase/tours";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
        </Table>
      )}
    </>
  );
}
