"use client";

import { CartItem } from "@/types/Cart";
import Image from "next/image";
import { getImageUrl } from "@/lib/imageHelpers";
import { Button } from "@/components/ui/button";
import { Trash2, MapPin, Pencil, Activity, GripVertical } from "lucide-react";
import { removeFromCart } from "@/data/cart";
import { toast } from "sonner";
import { useState } from "react";
import { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";

interface CartCardProps {
  item: CartItem;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
  onEdit?: () => void;
}

export default function CartCard({
  item,
  dragHandleProps,
  onEdit,
}: CartCardProps) {
  const [isRemoving, setIsRemoving] = useState(false);

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
    if (onEdit) {
      onEdit();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-shadow hover:shadow-md w-full">
      <div className="flex">
        {/* Image Section */}
        <div className="relative flex-shrink-0 w-24 sm:w-32 md:w-40">
          {item.tourImages?.[0] ? (
            <Image
              src={getImageUrl(item.tourImages[0])}
              alt={item.tourTitle}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <MapPin className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row justify-between sm:items-start">
            {/* Left Column - Tour Details */}
            <div className="flex-1 mb-2 sm:mb-0 sm:pr-4">
              <h3 className="text-base sm:text-lg font-bold text-gray-800 line-clamp-1">
                {item.tourTitle}
              </h3>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mt-1">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="line-clamp-1">{item.tourTitle}, Georgia</span>
              </div>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mt-2">
                <Activity className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                {item.selectedActivities.length > 0 ? (
                  <span>
                    {item.selectedActivities.length} activit
                    {item.selectedActivities.length > 1 ? "ies" : "y"}{" "}
                    selected
                  </span>
                ) : (
                  <span className="text-gray-500">No activities selected</span>
                )}
              </div>
            </div>

            {/* Right Column - Action Buttons */}
            <div className="flex-shrink-0 flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEditItem}
                className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full h-8 w-8"
                title="Edit booking details"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemoveItem}
                disabled={isRemoving}
                className="text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full h-8 w-8"
                title="Remove from cart"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Bottom Row - Price and Booking Button */}
          <div className="flex items-center justify-between mt-2 sm:mt-0">
            <div className="text-lg sm:text-xl font-bold text-red-500">
              ${item.totalPrice || 299}
            </div>
            <div>
              <Button
                size="sm"
                onClick={!item.isComplete ? handleEditItem : undefined}
                disabled={item.isComplete}
                className={`rounded-full px-4 py-1 text-sm font-semibold transition-colors ${
                  item.isComplete
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {item.isComplete ? "Finished" : "Finish booking"}
              </Button>
            </div>
          </div>
        </div>

        {/* Drag Handle */}
        <div
          {...dragHandleProps}
          className="flex items-center justify-center w-10 bg-gray-50 border-l border-gray-200 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
