"use client";

import { useCart } from "@/context/cart";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Link } from "@/i18n/navigation";
import CartCard from "@/components/cart-card";
import OrderSummary from "@/components/order-summary";
import UnifiedBookingForm from "@/components/unified-booking-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Tour } from "@/types/Tour";
import { CartItem } from "@/types/Cart";

interface CartClientProps {
  tours: Tour[];
}

export default function CartClient({ tours }: CartClientProps) {
  const cart = useCart();

  // Edit modal state
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);

  const getTourForItem = (item: CartItem) => {
    return tours.find((tour) => tour.id === item.tourId);
  };

  const handleEditItem = (item: CartItem) => {
    setEditingItem(item);
  };

  if (cart.loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="text-center">
          <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Your Cart is Empty
          </h1>
          <p className="text-gray-600 mb-4">
            Start exploring our tours to add them to your cart
          </p>
          <Link href="/">
            <Button>Browse Tours</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="flex items-center gap-3 mb-6">
          <ShoppingCart className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Your Cart</h1>
          <span className="bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {cart.totalItems} {cart.totalItems === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <CartCard
                key={item.id}
                item={item}
                onEdit={() => handleEditItem(item)}
              />
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <OrderSummary mode="cart" showDetailedBreakdown={true} />
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <Dialog open onOpenChange={() => setEditingItem(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Booking</DialogTitle>
            </DialogHeader>
            <UnifiedBookingForm
              tour={getTourForItem(editingItem)!}
              mode="cart-edit"
              cartItem={editingItem}
              onSuccess={() => setEditingItem(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
