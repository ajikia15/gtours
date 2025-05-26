"use client";

/**
 * Shopping Cart Context Provider
 *
 * This file provides a React context for managing shopping cart state across the application.
 * It handles real-time synchronization with Firestore and provides cart data to all components.
 */

import { createContext, useContext, useEffect, useState } from "react";
import { CartItem } from "@/types/Cart";
import { subscribeToCart, subscribeToCartSummary } from "@/lib/cart-client";
import { useAuth } from "./auth";

/**
 * Type definition for the cart context value
 */
type CartContextType = {
  /** Array of all cart items */
  items: CartItem[];
  /** Total number of items in cart */
  totalItems: number;
  /** Total price of all items in cart */
  totalPrice: number;
  /** Whether cart data is currently loading */
  loading: boolean;
  /** Error message if cart operations fail */
  error: string | null;
};

/**
 * React context for cart state
 */
const CartContext = createContext<CartContextType | null>(null);

/**
 * Cart Provider Component
 *
 * Wraps the application to provide cart state to all child components.
 * Automatically subscribes to cart updates when user is authenticated.
 *
 * @param children - React children to wrap with cart context
 *
 * @example
 * ```tsx
 * <CartProvider>
 *   <App />
 * </CartProvider>
 * ```
 */
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset cart state when user logs out
    if (!auth?.currentUser) {
      setItems([]);
      setTotalItems(0);
      setTotalPrice(0);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    // Subscribe to real-time cart items updates
    const unsubscribeItems = subscribeToCart(
      auth.currentUser.uid,
      (cartItems) => {
        setItems(cartItems);
        setLoading(false);
      },
      (error) => {
        console.error("Cart items subscription error:", error);
        setError(error.message);
        setLoading(false);
      }
    );

    // Subscribe to real-time cart summary updates
    const unsubscribeSummary = subscribeToCartSummary(
      auth.currentUser.uid,
      (summary) => {
        setTotalItems(summary.totalItems);
        setTotalPrice(summary.totalPrice);
      },
      (error) => {
        console.error("Cart summary subscription error:", error);
        setError(error.message);
      }
    );

    // Cleanup subscriptions when component unmounts or user changes
    return () => {
      unsubscribeItems();
      unsubscribeSummary();
    };
  }, [auth?.currentUser]);

  const contextValue: CartContextType = {
    items,
    totalItems,
    totalPrice,
    loading,
    error,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

/**
 * Hook to access cart context
 *
 * @returns CartContextType - The current cart state and methods
 * @throws Error if used outside of CartProvider
 *
 * @example
 * ```tsx
 * const { items, totalItems, loading } = useCart();
 * ```
 */
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
