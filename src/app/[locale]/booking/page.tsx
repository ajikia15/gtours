import { getTours, getTourById } from "@/data/tours";
import BookingPageClient from "./booking-page-client";

interface BookingPageProps {
  searchParams?: Promise<{
    tourId?: string | string[];
    [key: string]: string | string[] | undefined;
  }>;
}

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const { data: tours } = await getTours({
    pagination: { page: 1, pageSize: 50 }, // Get more tours for selection
  });

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const tourIdParam = resolvedSearchParams.tourId;
  const tourId = Array.isArray(tourIdParam) ? tourIdParam[0] : tourIdParam;

  let preselectedTour = null;
  if (tourId) {
    try {
      preselectedTour = await getTourById(tourId);
    } catch (error) {
      console.error("Failed to fetch tour:", error);
      // Continue without preselected tour
    }
  }

  return <BookingPageClient tours={tours} preselectedTour={preselectedTour} />;
}
