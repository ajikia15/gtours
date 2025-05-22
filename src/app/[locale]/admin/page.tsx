import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { PlusCircleIcon } from "lucide-react";
import ToursTable from "./Tours-table";
import { Suspense } from "react";
import ToursTableSkeleton from "./tours-table-skeleton";

export default async function AdminDashboard({
  searchParams,
  params,
}: {
  searchParams?: Promise<any>;
  params: Promise<{ locale: string }> | { locale: string };
}) {
  const searchParamsValue = await searchParams;
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
          <ToursTable
            page={
              searchParamsValue?.page ? parseInt(searchParamsValue.page) : 1
            }
            params={params}
          />
        </Suspense>
      </div>
    </div>
  );
}
