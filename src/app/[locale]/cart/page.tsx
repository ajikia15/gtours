"use client";

import { useCart } from "@/context/cart";
import { useAuth } from "@/context/auth";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, Calendar, Users, MapPin } from "lucide-react";
import { removeFromCart, updateCartItem } from "@/data/cart";
import { toast } from "sonner";
import { useState } from "react";
import { getImageUrl } from "@/lib/imageHelpers";
import Image from "next/image";
import { format } from "date-fns";
import { Link } from "@/i18n/navigation";

export default function CartPage() {
  const auth = useAuth();
  const cart = useCart();
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());

  const handleRemoveItem = async (itemId: string) => {
    setRemovingItems((prev) => new Set(prev).add(itemId));

    try {
      const result = await removeFromCart(itemId);
      if (result.success) {
        toast.success("Item removed from cart");
      } else {
        toast.error(result.message || "Failed to remove item");
      }
    } catch (error) {
      toast.error("Failed to remove item");
    } finally {
      setRemovingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  if (!auth?.currentUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Cart</h1>
          <p className="text-gray-600 mb-4">Please sign in to view your cart</p>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (cart.loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
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
    <div className="container mx-auto px-4 py-8">
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
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex gap-4">
                {/* Tour Image */}
                <div className="flex-shrink-0">
                  <Image
                    src={getImageUrl(item.tourImages?.[0])}
                    alt={item.tourTitle}
                    width={120}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                </div>

                {/* Tour Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.tourTitle}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={removingItems.has(item.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Booking Details */}
                  <div className="space-y-2 text-sm text-gray-600">
                    {item.selectedDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{format(item.selectedDate, "PPP")}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>
                        {item.travelers.adults} adults
                        {item.travelers.children > 0 &&
                          `, ${item.travelers.children} children`}
                        {item.travelers.infants > 0 &&
                          `, ${item.travelers.infants} infants`}
                      </span>
                    </div>

                    {item.selectedActivities.length > 0 && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {item.selectedActivities.length} activities selected
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="mt-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status === "ready"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {item.status === "ready" ? "Ready to book" : "Incomplete"}
                    </span>
                  </div>

                  {/* Price Breakdown */}
                  <div className="mt-3 text-right">
                    {item.activityPriceIncrement > 0 && (
                      <div className="text-sm text-gray-600 mb-1">
                        Activities: +{item.activityPriceIncrement} GEL
                      </div>
                    )}
                    <span className="text-lg font-semibold text-gray-900">
                      Total: {item.totalPrice} GEL
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Items ({cart.totalItems})</span>
                <span>{cart.totalPrice} GEL</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{cart.totalPrice} GEL</span>
              </div>
            </div>

            <Button className="w-full mt-6" size="lg">
              Proceed to Checkout
            </Button>

            <p className="text-xs text-gray-500 mt-3 text-center">
              Complete incomplete items to proceed with booking
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
