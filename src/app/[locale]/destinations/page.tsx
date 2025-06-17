import { getTranslations } from "next-intl/server";
import Header from "../header";
import { Suspense } from "react";
import TourCardSkeleton from "@/components/tour-card-skeleton";
import DestinationsContent from "@/components/destinations-content";
import SearchBarContent from "@/components/search-bar-content";

interface SearchParams {
  destinations?: string;
  activities?: string;
  date?: string;
  adults?: string;
  children?: string;
  infants?: string;
}

interface DestinationsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}

export default async function DestinationsPage({
  params,
  searchParams,
}: DestinationsPageProps) {
  const t = await getTranslations("Pages.destinations");
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  return (
    <>
      <Header title={t("title")} />
      <h2 className="text-2xl font-bold my-8 text-center">მოძებნე</h2>
      <Suspense
        fallback={
          <div className="my-8 max-w-4xl mx-auto">
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        }
      >
        <SearchBarContent />
      </Suspense>{" "}
      <Suspense
        fallback={
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
            {Array.from({ length: 8 }, (_, index) => (
              <TourCardSkeleton key={`skeleton-${index}`} />
            ))}
          </section>
        }
      >
        <DestinationsContent
          locale={resolvedParams.locale}
          searchParams={resolvedSearchParams}
        />
      </Suspense>
    </>
  );
}
