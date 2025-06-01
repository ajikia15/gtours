"use client";

import { useState, useMemo } from "react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useBooking } from "@/context/booking";
import { useCart } from "@/context/cart";
import { updateCartItem } from "@/data/cart";
import { Tour } from "@/types/Tour";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  tour: Tour;
  selectedActivities?: string[];
  className?: string;
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "destructive"
    | "secondary"
    | "brandred";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
  detectChanges?: boolean; // Enable change detection for complex forms
  initialState?: {
    selectedDate: Date | undefined;
    travelers: { adults: number; children: number; infants: number };
    selectedActivities: string[];
    initialized: boolean;
  };
  onUpdateSuccess?: () => void; // Callback after successful update
  text?: boolean;
}

export default function AddToCartButton({
  tour,
  selectedActivities = [],
  className,
  variant = "outline",
  size = "default",
  showIcon = true,
  detectChanges = false,
  initialState,
  onUpdateSuccess,
  text = true,
}: AddToCartButtonProps) {
  const booking = useBooking();
  const cart = useCart();
  const router = useRouter();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Find existing cart item for this tour
  const existingCartItem = cart.items.find((item) => item.tourId === tour.id);
  const { selectedDate, travelers } = booking.sharedState;

  // Check if user has made changes (only if detectChanges is enabled)
  const hasUserMadeChanges = useMemo(() => {
    if (
      !detectChanges ||
      !initialState ||
      !initialState.initialized ||
      !existingCartItem
    )
      return false;

    const dateChanged =
      initialState.selectedDate?.getTime() !== selectedDate?.getTime();
    const travelersChanged =
      initialState.travelers.adults !== travelers.adults ||
      initialState.travelers.children !== travelers.children ||
      initialState.travelers.infants !== travelers.infants;
    const activitiesChanged =
      initialState.selectedActivities.length !== selectedActivities.length ||
      !initialState.selectedActivities.every((activity) =>
        selectedActivities.includes(activity)
      );

    return dateChanged || travelersChanged || activitiesChanged;
  }, [
    detectChanges,
    initialState,
    existingCartItem,
    selectedDate,
    travelers,
    selectedActivities,
  ]);

  const handleCartAction = async () => {
    setIsAddingToCart(true);

    try {
      if (existingCartItem && hasUserMadeChanges) {
        // Update existing cart item
        const result = await updateCartItem(existingCartItem.id, {
          selectedDate,
          travelers,
          selectedActivities,
        });

        if (result?.success !== false) {
          onUpdateSuccess?.(); // Call the callback to reset initial state
          router.push("/cart");
        }
      } else if (!existingCartItem) {
        // Add new item to cart
        await booking.addPartialBookingToCart(tour, selectedActivities);
      }
    } catch (error) {
      console.error("Failed to handle cart action:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Determine button content and behavior
  if (existingCartItem && hasUserMadeChanges) {
    return (
      <Button
        className={cn("", className)}
        variant={variant}
        size={size}
        onClick={handleCartAction}
        disabled={isAddingToCart}
      >
        {isAddingToCart ? (
          "Updating..."
        ) : (
          <>
            {showIcon && <ShoppingCart className="size-4 mr-2" />}
            Update in Cart
          </>
        )}
      </Button>
    );
  }

  if (existingCartItem) {
    return (
      <Link href="/cart">
        <Button className={cn("", className)} variant="secondary" size={size}>
          {showIcon && <Eye className="size-4" />}
          View in Cart
        </Button>
      </Link>
    );
  }

  return (
    <Button
      className={cn("", className)}
      variant={variant}
      size={size}
      onClick={handleCartAction}
      disabled={isAddingToCart}
    >
      {showIcon && <ShoppingCart className={`size-4 ${text ? "mr-2" : ""}`} />}
      {isAddingToCart ? "Adding..." : text ? "Add to Cart" : ""}
    </Button>
  );
}
