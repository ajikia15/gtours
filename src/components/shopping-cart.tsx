"use client";
import { ShoppingCartIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/context/cart";
import { useAuth } from "@/context/auth";
import { Button } from "./ui/button";
export default function ShoppingCart() {
  const auth = useAuth();
  const cart = useCart();

  if (!auth?.currentUser) {
    return null;
  }

  return (
    <Link
      href="/account/cart"
      aria-label={`Shopping cart with ${cart.totalItems} items`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        aria-label={`View cart (${cart.totalItems} items)`}
      >
        <ShoppingCartIcon className="h-5 w-5" aria-hidden="true" />
        {cart.totalItems > 0 && (
          <span
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
            aria-label={`${cart.totalItems} items in cart`}
          >
            {cart.totalItems > 99 ? "99+" : cart.totalItems}
          </span>
        )}
      </Button>
    </Link>
  );
}
