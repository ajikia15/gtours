"use client";

/**
 * Shopping Cart Navigation Component
 *
 * This component displays a shopping cart icon in the navigation bar with a badge
 * showing the current number of items. Only visible when user is authenticated.
 */

import { ShoppingCartIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/context/cart";
import { useAuth } from "@/context/auth";
import { Button } from "./ui/button";

/**
 * Shopping Cart Component
 *
 * Renders a shopping cart icon with item count badge in the navigation.
 * Automatically hides when user is not authenticated.
 *
 * @returns JSX.Element | null - Cart icon with badge or null if not authenticated
 *
 * @example
 * ```tsx
 * <nav>
 *   <ShoppingCart />
 * </nav>
 * ```
 */
export default function ShoppingCart() {
  const auth = useAuth();
  const cart = useCart();

  // Don't show cart if user is not logged in
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
