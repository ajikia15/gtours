"use client";
import TourDatePicker from "@/components/booking/tour-date-picker";
import TravelerSelection from "@/components/booking/traveler-selection";
import { Button } from "@/components/ui/button";
import { Tour } from "@/types/Tour";
import { Clock, Luggage, MapPin, RotateCcw, ShoppingCart } from "lucide-react";
import { Link } from "@/i18n/navigation";
export default function TourDetailsCard({ tour }: { tour: Tour }) {
  return (
    <div className="flex flex-col gap-4 px-6 pb-6 pt-3 bg-white rounded-xl shadow-sm w-full min-w-84 border border-gray-100">
      <h3 className="text-xl font-semibold text-center">Tour Details</h3>
      <div className="flex flex-col gap-3">
        {tour.title && ( // replace with location name later
          <div className="flex items-center gap-2 text-gray-700">
            <MapPin className="size-5 text-red-500" />
            <span>{tour.title}</span>
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

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Choose Date
        </h2>
        <TourDatePicker />
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Travelers</h2>
        <TravelerSelection />
      </div>
      <div className=" flex justify-between items-center">
        <span className="text-lg font-semibold">
          Total: <span className="text-red-500">{tour.basePrice} GEL</span>
        </span>
      </div>
      <Button className="w-full" variant="outline">
        <ShoppingCart className="size-4 mr-2" />
        <p>Add to Cart</p>
      </Button>
      <Button className="w-full " variant="brandred">
        Book Tour
      </Button>
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
