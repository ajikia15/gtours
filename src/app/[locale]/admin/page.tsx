import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { PlusCircleIcon, BookOpenIcon, RouteIcon } from "lucide-react";
import ToursTable from "./Tours-table";
import BlogsTable from "./blogs/Blogs-table";
import { Suspense } from "react";
import TableSkeleton from "@/components/ui/table-skeleton";
import { getTranslations } from "next-intl/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  const activeTab = searchParams?.tab
    ? Array.isArray(searchParams.tab)
      ? searchParams.tab[0]
      : searchParams.tab
    : "tours";

  return (
    <div>
      <h1 className="text-3xl font-bold my-4">{t("title")}</h1>

      <Tabs defaultValue={activeTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tours" className="flex items-center gap-2">
            <RouteIcon className="h-4 w-4" />
            {t("tours")}
          </TabsTrigger>
          <TabsTrigger value="blogs" className="flex items-center gap-2">
            <BookOpenIcon className="h-4 w-4" />
            {t("blogs")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tours" className="space-y-4">
          <Button>
            <Link href="/admin/tours/new" className="flex items-center gap-2">
              <PlusCircleIcon className="size-4" />
              {t("newTour")}
            </Link>
          </Button>

          <div className="mt-4">
            <Suspense fallback={<TableSkeleton />}>
              <ToursTable page={page} params={params} />
            </Suspense>
          </div>
        </TabsContent>

        <TabsContent value="blogs" className="space-y-4">
          <Button>
            <Link href="/admin/blogs/new" className="flex items-center gap-2">
              <PlusCircleIcon className="size-4" />
              {t("newBlog")}
            </Link>
          </Button>

          <div className="mt-4">
            <Suspense fallback={<TableSkeleton />}>
              <BlogsTable page={page} params={params} />
            </Suspense>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
