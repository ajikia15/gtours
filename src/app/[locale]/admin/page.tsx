import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { PlusCircleIcon } from "lucide-react";
import ToursTable from "./Tours-table";
import { Suspense } from "react";
import ToursTableSkeleton from "./tours-table-skeleton";

export default async function AdminDashboard({
  searchParams: searchParamsPromise,
  params: paramsPromise,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ locale: string }>;
}) {
  const searchParams = await searchParamsPromise;
  const params = await paramsPromise;

  const pageQueryParam = searchParams?.page;
  const page = pageQueryParam
    ? parseInt(
        Array.isArray(pageQueryParam) ? pageQueryParam[0] : pageQueryParam,
        10
      )
    : 1;

  return (
    <div>
      <h1 className="text-3xl font-bold my-4 ">Admin Dashboard</h1>
      <Button>
        <Link href="/admin/tours/new" className="flex items-center gap-2">
          <PlusCircleIcon className="size-4 " />
          New Tour
        </Link>
      </Button>

      <div className="mt-4">
        <Suspense fallback={<ToursTableSkeleton />}>
          <ToursTable page={page} params={params} />
        </Suspense>
      </div>
    </div>
  );
}
