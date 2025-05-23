import { Button } from "@/components/ui/button";
import { Tour } from "@/types/Tour";
import {
  Clock,
  Luggage,
  MapPin,
  Minus,
  Plus,
  RotateCcw,
  ShoppingCart,
  Users,
} from "lucide-react";
export default function TourDetailsCard({ tour }: { tour: Tour }) {
  return (
    <div className="flex flex-col gap-4 px-6 pb-6 pt-3 bg-white rounded-xl shadow-lg w-full min-w-84">
      <h3 className="text-xl font-semibold text-center">Tour Details</h3>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-gray-700">
          <MapPin className="size-5 text-red-500" />
          <span>
            Latitude: {tour.lat}, Longitude: {tour.long}
          </span>
        </div>
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
        <div className="flex items-center gap-2 text-gray-700">
          <Users className="size-5 text-red-500" />
          <span>12-15 Guests</span>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-md font-medium">Add Tour:</h4>
        <div className="flex items-center justify-between p-2 border border-red-500 rounded-md mt-2">
          <Button variant="ghost" size="icon" className="text-red-500">
            <Minus className="size-5" />
          </Button>
          <span className="font-semibold">Adult Tour</span>
          <Button variant="ghost" size="icon" className="text-red-500">
            <Plus className="size-5" />
          </Button>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
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
    </div>
  );
}
