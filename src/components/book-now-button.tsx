"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { ShoppingCart } from "lucide-react";

interface BookNowButtonProps {
  tourId: string;
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
  tourId,
  variant = "brandred",
  size = "lg",
  className = "",
  children,
}: BookNowButtonProps) {
  const router = useRouter();

  const handleBookNow = () => {
    router.push(`/booking?tourId=${tourId}`);
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleBookNow}
    >
      {children || (
        <>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Book Now
        </>
      )}
    </Button>
  );
}
