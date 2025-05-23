import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { PlusCircleIcon } from "lucide-react";
import ActivitiesTable from "./Activities-table";
import { Suspense } from "react";
import ActivitiesTableSkeleton from "./activities-table-skeleton";
import { getTranslations } from "next-intl/server";

export default async function AdminActivitiesPage({
  searchParams: searchParamsPromise,
  params: paramsPromise,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ locale: string }>;
}) {
  const searchParams = await searchParamsPromise;
  const resolvedParams = await paramsPromise; // Resolve params
  const t = await getTranslations("AdminActivitiesPage"); // For localization

  const pageQueryParam = searchParams?.page;
  const page = pageQueryParam
    ? parseInt(
        Array.isArray(pageQueryParam) ? pageQueryParam[0] : pageQueryParam,
        10
      )
    : 1;

  return (
    <div>
      <h1 className="text-3xl font-bold my-4 ">{t("title")}</h1>
      <Button asChild>
        <Link href="/admin/activities/new" className="flex items-center gap-2">
          <PlusCircleIcon className="size-4 " />
          {t("newActivityButton")}
        </Link>
      </Button>

      <div className="mt-4">
        <Suspense fallback={<ActivitiesTableSkeleton />}>
          {/* Assuming ActivitiesTable will fetch its own data like ToursTable does */}
          {/* We'll need to implement getAllActivityTypes and pass it or call it within ActivitiesTable */}
          <ActivitiesTable page={page} params={resolvedParams} />{" "}
          {/* Pass resolvedParams */}
        </Suspense>
      </div>
    </div>
  );
}
