"use client";

import { useRouter } from "@/i18n/navigation";
import BookingBar from "@/components/booking-bar";
import { useCart } from "@/context/cart";
import { Tour } from "@/types/Tour";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface EditBookingPageClientProps {
  tours: Tour[];
  itemId: string;
}

export default function EditBookingPageClient({
  tours,
  itemId,
}: EditBookingPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const directBooking = searchParams?.get("directBooking") === "1";
  const cart = useCart();

  const editingItem = cart.items?.find((item) => item.id === itemId);

  const handleSuccess = () => {
    // Redirect back to cart after successful update
    router.push("/account/cart");
  };

  const handleBack = () => {
    router.push("/account/cart");
  };

  if (cart.loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // If cart is loaded but item is not found
  if (!cart.loading && (!cart.items || !editingItem)) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Cart Item Not Found</h1>
          <p className="text-gray-600 mb-6">
            The cart item you&apos;re trying to edit could not be found.
          </p>
          <Button onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>
        </Card>
      </div>
    );
  }

  // At this point we know editingItem exists
  const item = editingItem!;

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Booking</h1>
          <p className="text-gray-600">
            Modify your booking details for {item.tourTitle}
          </p>
        </div>
      </div>

      {/* Current Item Info */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="secondary">Editing</Badge>
            <div>
              <h3 className="font-semibold">{item.tourTitle}</h3>
              <p className="text-sm text-gray-600">
                Current total: {item.totalPrice} GEL
              </p>
            </div>
          </div>
          <div className="text-right text-sm text-gray-500">
            <p>Created: {item.createdAt?.toLocaleDateString()}</p>
            <p>Last updated: {item.updatedAt?.toLocaleDateString()}</p>
          </div>
        </div>
      </Card>

      {/* Edit Form */}
      <BookingBar
        tours={tours}
        mode="edit"
        editingItem={item}
        onSuccess={handleSuccess}
        directBooking={directBooking}
      />

      {/* Help Text */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <h3 className="font-medium text-blue-900 mb-2">Editing Notes</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• You cannot change the tour when editing an existing booking</li>
          <li>
            • Date and traveler changes will only affect this specific booking
          </li>
          <li>• Activity selections are specific to this tour only</li>
          <li>• Pricing will be recalculated automatically</li>
        </ul>
      </Card>
    </div>
  );
}
