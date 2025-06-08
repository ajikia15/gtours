import { getTours } from "@/data/tours";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    
    const { data } = await getTours({
      pagination: { page, pageSize },
    });    // Create a clean version of the data to avoid serialization issues
    const serializedTours = data.map((tour) => ({
      id: tour.id,
      title: tour.title,
      subtitle: tour.subtitle,
      description: tour.description,
      basePrice: tour.basePrice,
      duration: tour.duration,
      leaveTime: tour.leaveTime,
      returnTime: tour.returnTime,
      coordinates: tour.coordinates,
      status: tour.status,
      images: tour.images || [],
      offeredActivities: tour.offeredActivities || [],
    }));

    return NextResponse.json(serializedTours);
  } catch (error) {
    console.error("Error fetching tours:", error);
    return NextResponse.json(
      { error: "Failed to fetch tours" },
      { status: 500 }
    );
  }
}
