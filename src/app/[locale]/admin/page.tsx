import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { PlusCircleIcon } from "lucide-react";
import ToursTable from "./Tours-table";
import { Suspense } from "react";
import TableSkeleton from "@/components/ui/table-skeleton";
import { getTranslations } from "next-intl/server";

export default async function AdminDashboard({
  searchParams: searchParamsPromise,
  params: paramsPromise,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ locale: string }>;
}) {
  const searchParams = await searchParamsPromise;
  const params = await paramsPromise;
  const t = await getTranslations("Admin.dashboard");

  const pageQueryParam = searchParams?.page;
  const page = pageQueryParam
    ? parseInt(
        Array.isArray(pageQueryParam) ? pageQueryParam[0] : pageQueryParam,
        10
      )
    : 1;

  return (
    <div>
      <h1 className="text-3xl font-bold my-4">{t("title")}</h1>
      <Button>
        <Link href="/admin/tours/new" className="flex items-center gap-2">
          <PlusCircleIcon className="size-4" />
          {t("newTour")}
        </Link>
      </Button>

      <div className="mt-4">
        <Suspense fallback={<TableSkeleton />}>
          <ToursTable page={page} params={params} />
        </Suspense>{" "}
      </div>
    </div>
  );
}
