"use client";
import { Tour } from "@/types/Tour";
import TourDetailsBooker from "./tour-details-booker";
import { GripHorizontal } from "lucide-react";

export default function MobileTourBooker({ tour }: { tour: Tour }) {
  return (
    <div className="flex flex-col items-center justify-center w-full px-4 bg-white fixed bottom-0 inset-x-0 mb-20  shadow-lg border-t border border-gray-200">
      <div className="flex justify-center pb-2">
        <GripHorizontal />
      </div>
      <div className="flex items-center justify-between w-full pt-4">
        <h1 className="text-2xl font-bold ">420</h1>
        <p className="text-gray-600">Buy now</p>
      </div>
      <TourDetailsBooker tour={tour} collapseAble={false} />
    </div>
  );
}
