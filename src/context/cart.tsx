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

type CartContextType = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  loading: boolean;
  error: string | null;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
