"use client";

import { CartItem } from "@/types/Cart";
import Image from "next/image";
import { getImageUrl } from "@/lib/imageHelpers";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar, Users, MapPin, Pencil } from "lucide-react";
import { format } from "date-fns";
import { removeFromCart } from "@/data/cart";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "@/i18n/navigation";

interface CartCardProps {
  item: CartItem;
}

export default function CartCard({ item }: CartCardProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const router = useRouter();

  const handleRemoveItem = async () => {
    setIsRemoving(true);

    try {
      const result = await removeFromCart(item.id);
      if (result.success) {
        toast.success("Item removed from cart");
      } else {
        toast.error(result.message || "Failed to remove item");
      }
    } catch (error) {
      toast.error("Failed to remove item");
    } finally {
      setIsRemoving(false);
    }
  };

  const handleEditItem = () => {
    router.push(`/cart/edit/${item.id}`);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex">
        {/* Image Section */}
        <div className="relative w-48 h-32 flex-shrink-0">
          <Image
            src={getImageUrl(item.tourImages?.[0])}
            alt={item.tourTitle}
            fill
            className="object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            {/* Header with Title and Action Buttons */}
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 pr-2">
                {item.tourTitle}
              </h3>
              <div className="flex gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditItem}
                  className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full p-1"
                  title="Edit booking details"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveItem}
                  disabled={isRemoving}
                  className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full p-1"
                  title="Remove from cart"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span>Tbilisi, Georgia</span>
            </div>

            {/* Booking Details */}
            <div className="space-y-1 text-sm text-gray-600 mb-3">
              {item.selectedDate ? (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span>{format(item.selectedDate, "PPP")}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-600">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span>Date not selected</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 flex-shrink-0" />
                <span>
                  {item.travelers.adults} adults
                  {item.travelers.children > 0 &&
                    `, ${item.travelers.children} children`}
                  {item.travelers.infants > 0 &&
                    `, ${item.travelers.infants} infants`}
                </span>
              </div>

              {item.selectedActivities.length > 0 && (
                <div className="text-gray-600">
                  {item.selectedActivities.length} activities selected
                </div>
              )}
            </div>
          </div>

          {/* Bottom Section with Price and Button */}
          <div className="flex justify-between items-center">
            <div className="text-right">
              {item.activityPriceIncrement > 0 && (
                <div className="text-xs text-gray-500 mb-1">
                  +{item.activityPriceIncrement} GEL activities
                </div>
              )}
              <div className="text-xl font-bold text-red-600">
                ₾{item.totalPrice}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className={`${
                item.status === "ready"
                  ? "bg-green-100 hover:bg-green-200 text-green-700 border-green-300"
                  : "bg-yellow-100 hover:bg-yellow-200 text-yellow-700 border-yellow-300"
              }`}
            >
              {item.status === "ready" ? "Ready for booking" : "Finish booking"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
