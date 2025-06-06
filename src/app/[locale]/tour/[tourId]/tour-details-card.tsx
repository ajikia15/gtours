"use server";

import { Tour } from "@/types/Tour";
import { Clock, Luggage, MapPin, RotateCcw } from "lucide-react";
import { Link } from "@/i18n/navigation";
import TourDetailsBooker from "./tour-details-booker";
import { getLocalizedTitle } from "@/lib/localizationHelpers";
import { getLocale } from "next-intl/server";

export default async function TourDetailsCard({ tour }: { tour: Tour }) {
  const locale = await getLocale();

  return (
    <div className="flex flex-col gap-4 px-6 pb-6 pt-3 bg-white rounded-xl shadow-sm w-full min-w-84 border border-gray-100">
      <h3 className="text-lg font-semibold ">Tour Details</h3>
      <div className="flex flex-col gap-3">
        {tour.title && ( // TODO replace with location name later
          <div className="flex items-center gap-2 text-gray-700">
            <MapPin className="size-5 text-red-500" />
            <span>{getLocalizedTitle(tour, locale)}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-gray-700">
          <Clock className="size-5 text-red-500" />
          <span>Tour duration: {tour.duration} days</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <Luggage className="size-5 text-red-500" />
          <span>Departs: {tour.leaveTime}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <RotateCcw className="size-5 text-red-500" />
          <span>Returns: {tour.returnTime}</span>
        </div>
      </div>
      <TourDetailsBooker tour={tour} />
      <p className="text-center text-gray-500 text-sm ">
        Got any questions?
        <Link
          href="/contact"
          className="hover:underline ml-1 text-brand-secondary font-semibold"
        >
          Contact us
        </Link>
      </p>
    </div>
  );
}
