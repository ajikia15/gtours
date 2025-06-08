"use client";

import { useState, useMemo } from "react";
import { useRouter } from "@/i18n/navigation";
import { useCart } from "@/context/cart";
import { useBooking } from "@/context/booking";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye, Plus } from "lucide-react";
import { Tour } from "@/types/Tour";
import { toast } from "sonner";
import { updateCartItem } from "@/data/cart";

interface TourActionButtonProps {
  tour: Tour;
  selectedActivities?: string[];
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary" | "brandred";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
  showIcon?: boolean;
  text?: boolean;
  intent?: "primary" | "secondary"; // New prop for button behavior
  detectChanges?: boolean; // Enable change detection for complex forms
  initialState?: {
    selectedDate: Date | undefined;
    travelers: { adults: number; children: number; infants: number };
    selectedActivities: string[];
    initialized: boolean;
  };
  onUpdateSuccess?: () => void; // Callback after successful update
}

export default function TourActionButton({
  tour,
  selectedActivities = [],
  variant = "brandred", 
  size = "lg",
  className = "",
  children,
  showIcon = true,
  text = true,
  intent = "primary",
  detectChanges = false,
  initialState,
  onUpdateSuccess,
}: TourActionButtonProps) {
  const router = useRouter();
  const cart = useCart();
  const booking = useBooking();
  const [isProcessing, setIsProcessing] = useState(false);

  // Determine current state
  const existingCartItem = cart.items.find((item) => item.tourId === tour.id);
  const hasCartItems = cart.items.length > 0;
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

  // Determine button behavior based on state
  const getButtonState = () => {
    if (existingCartItem && hasUserMadeChanges) {
      return {
        action: "update-cart",
        text: "Update Cart",
        icon: <ShoppingCart className="h-4 w-4" />,
        variant: "brandred" as const
      };
    }
    
    if (existingCartItem) {
      return {
        action: "view-cart",
        text: "View in Cart",
        icon: <Eye className="h-4 w-4" />,
        variant: "secondary" as const
      };
    }
    
    // For intent="primary", prefer direct booking over cart addition
    if (intent === "primary") {
      return {
        action: "book-now",
        text: "Book Now",
        icon: <ShoppingCart className="h-4 w-4" />,
        variant: variant
      };
    }
    
    // For intent="secondary", add to cart if other items exist
    if (hasCartItems) {
      return {
        action: "add-to-cart", 
        text: "Add to Cart",
        icon: <Plus className="h-4 w-4" />,
        variant: "outline" as const
      };
    }
    
    // Default: book now
    return {
      action: "book-now",
      text: "Book Now", 
      icon: <ShoppingCart className="h-4 w-4" />,
      variant: variant
    };
  };

  const handleAction = async () => {
    setIsProcessing(true);
    
    try {
      const buttonState = getButtonState();
      
      switch (buttonState.action) {
        case "view-cart":
          router.push("/account/cart");
          break;
          
        case "update-cart":
          // Update existing cart item
          if (existingCartItem) {
            const result = await updateCartItem(existingCartItem.id, {
              selectedDate,
              travelers,
              selectedActivities,
            });
            
            if (result?.success !== false) {
              onUpdateSuccess?.(); // Call the callback to reset initial state
              toast.success("Cart updated!");
              router.push("/account/cart");
            } else {
              toast.error("Failed to update cart");
            }
          }
          break;
          
        case "add-to-cart":
          // Use booking context to add to cart (requires shared state to be complete)
          const result = await booking.addBookingToCart(tour, selectedActivities);
          if (result.success) {
            // Stay on current page after adding to cart
            toast.success("Added to cart!");
          } else {
            toast.error(result.message || "Please complete booking details first");
          }
          break;
          
        case "book-now":
          // Store activities temporarily for navigation and go to direct booking page
          booking.setTempActivities(tour.id, selectedActivities);
          router.push(`/book/${tour.id}`);
          break;
      }
    } catch (error) {
      console.error("Action failed:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const buttonState = getButtonState();
  
  // Don't render secondary button if item is already in cart (avoid duplicate "View in Cart" buttons)
  if (intent === "secondary" && existingCartItem && !hasUserMadeChanges) {
    return null;
  }
  
  const displayText = isProcessing ? "Processing..." : buttonState.text;
  const buttonVariant = buttonState.variant;

  return (
    <Button
      variant={buttonVariant}
      size={size}
      className={className}
      onClick={handleAction}
      disabled={isProcessing}
    >
      {children || (
        <>
          {showIcon && buttonState.icon}
          {text && <span className={showIcon ? "ml-2" : ""}>{displayText}</span>}
        </>
      )}
    </Button>
  );
}
