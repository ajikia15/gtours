"use client";

import { CartItem } from "@/types/Cart";
import Image from "next/image";
import { getImageUrl } from "@/lib/imageHelpers";
import { Button } from "@/components/ui/button";
import { Trash2, MapPin, Pencil, Activity } from "lucide-react";
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
      toast.error(`Failed to remove item: ${error}`);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleEditItem = () => {
    router.push(`/cart/edit/${item.id}`);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden  transition-shadow">
      <div className="flex h-40 sm:h-44 md:h-48">
        {/* Image Section */}
        <div className="relative h-full bg-gray-100 aspect-[12/9] rounded-r-xl">
          {item.tourImages?.[0] ? (
            <Image
              src={getImageUrl(item.tourImages[0])}
              alt={item.tourTitle}
              fill
              className="object-cover rounded-r-xl"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <MapPin className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 flex">
          {/* Left Column - Tour Details */}
          <div className="flex-1 pr-4 flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-2">
              {item.tourTitle}
            </h3>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span>{item.tourTitle}, Georgia</span>
            </div>

            {/* Selected Activities */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <Activity className="h-4 w-4 flex-shrink-0" />
              {item.selectedActivities.length > 0 ? (
                <>
                  {item.selectedActivities.length} activit
                  {item.selectedActivities.length > 1 ? "ies" : "y"} selected
                </>
              ) : (
                <>No activities selected</>
              )}
            </div>

            {/* Placeholder Description */}
            <div className="text-sm text-gray-600 line-clamp-2">
              Experience the best of what this tour has to offer with carefully
              selected activities and destinations.
            </div>
          </div>

          {/* Right Column - Actions and Booking */}
          <div className="flex-1 flex flex-col justify-between items-end">
            {/* Top Row - Action Buttons */}
            <div className="flex gap-1">
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

            {/* Middle Row - Price (centered) */}
            <div className="text-red-600 font-semibold text-lg">
              ${item.totalPrice || 299}
            </div>

            {/* Bottom Row - Finish Booking Button */}
            <div>
              <Button
                size="sm"
                onClick={
                  item.status === "incomplete" ? handleEditItem : undefined
                }
                disabled={item.status === "ready"}
                className={`${
                  item.status === "ready"
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed hover:bg-gray-400"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {item.status === "ready"
                  ? "Booking finished"
                  : "Finish booking"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
