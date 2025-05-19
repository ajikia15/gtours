import { getTours } from "@/../firebase/tours";

export default async function ToursTable() {
  const { data } = await getTours({
    pagination: {
      page: 1,
      pageSize: 10,
    },
  });
  return (
    <>
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-muted-foreground">No tours found</p>
      </div>
    </>
  );
}
