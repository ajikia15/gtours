import { getTranslations } from "next-intl/server";
import Header from "../header";
import DestinationsContent from "@/components/destinations-content";
import SearchBarContent from "@/components/search-bar-content";
import { getPublishedTours } from "@/data/tours";

interface SearchParams {
  sortBy?: "price" | "alphabetical";
  sortOrder?: "asc" | "desc";
}

interface DestinationsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}

export default async function DestinationsPage({ 
  params, 
  searchParams 
}: DestinationsPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations("Pages.destinations");

  // Fetch published tours server-side - this should be cached
  const { data: tours } = await getPublishedTours();

  return (
    <>
      <Header title={t("title")} />
      <h2 className="text-2xl font-bold my-8 text-center">მოძებნე</h2>
      
      {/* Remove Suspense around SearchBarContent to prevent loading overlay on sort changes */}
      <div className="my-8 max-w-4xl mx-auto">
        <SearchBarContent />
      </div>
      
      {/* Tours Content */}
      <div className="container mx-auto px-4">
        <DestinationsContent 
          tours={tours}
          searchParams={resolvedSearchParams} 
          locale={resolvedParams.locale}
        />
      </div>
    </>
  );
}
