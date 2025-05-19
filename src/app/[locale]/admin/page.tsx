import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { PlusCircleIcon } from "lucide-react";
import ToursTable from "./Tours-table";

export default function AdminDashboard() {
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
      <ToursTable />
    </>
  );
}
