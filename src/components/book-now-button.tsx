"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { ShoppingCart } from "lucide-react";
import { useBooking } from "@/context/booking";
import { Tour } from "@/types/Tour";

interface BookNowButtonProps {
  tour: Tour;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive"
    | "brandred";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
}

export default function BookNowButton({
  tour,
  variant = "brandred",
  size = "lg",
  className = "",
  children,
}: BookNowButtonProps) {
  const router = useRouter();
  const booking = useBooking();
  const [isBooking, setIsBooking] = useState(false);

  const handleBookNow = async () => {
    setIsBooking(true);
    try {
      // Proceed directly to checkout with no selected activities (empty array)
      const result = await booking.proceedToDirectCheckout(tour, []);

      if (result.success && result.checkoutUrl) {
        router.push(result.checkoutUrl);
      }
    } catch (error) {
      console.error("Error in Book Now:", error);
    } finally {
      setIsBooking(false);
    }
  };
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleBookNow}
      disabled={isBooking}
    >
      {children || (
        <>
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isBooking ? "Booking..." : "Book Now"}
        </>
      )}
    </Button>
  );
}
