import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { PlusCircleIcon } from "lucide-react";
import ToursTable from "./Tours-table";

export default async function AdminDashboard({
  searchParams,
  params,
}: {
  searchParams?: Promise<any>;
  params: Promise<{ locale: string }> | { locale: string };
}) {
  const searchParamsValue = await searchParams;
  console.log({ searchParamsValue });
  return (
    <>
      <div>
        <Breadcrumbs items={[{ label: "Admin Dashboard" }]} />
      </div>
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <Button>
        <Link href="/admin/tours/new" className="flex items-center gap-2">
          <PlusCircleIcon className="size-4 " />
          New Tour
        </Link>
      </Button>
      <ToursTable
        page={searchParamsValue?.page ? parseInt(searchParamsValue.page) : 1}
        params={params}
      />
    </>
  );
}
