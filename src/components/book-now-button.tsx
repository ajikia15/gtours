"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { BookmarkCheck } from "lucide-react";
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
  const [isBooking, setIsBooking] = useState(false);

  const handleBookNow = async () => {
    setIsBooking(true);
    try {
      // Navigate directly to the booking page, bypassing cart manipulation
      router.push(`/book/${tour.id}`);
    } catch (error) {
      console.error("Error navigating to booking:", error);
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
          <BookmarkCheck className="h-4 w-4 mr-2" />
          {isBooking ? "Booking..." : "Book Now"}
        </>
      )}
    </Button>
  );
}
