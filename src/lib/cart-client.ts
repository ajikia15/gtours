"use client";

/**
 * Shopping Cart Client-Side Functions
 *
 * This file contains client-side functions for real-time cart subscriptions.
 * These functions use Firebase Firestore real-time listeners to keep the UI
 * synchronized with cart changes.
 */

import { firestore } from "@/firebase/client";
import { CartItem } from "@/types/Cart";
import {
  collection,
  doc,
  onSnapshot,
  query,
  orderBy,
  Unsubscribe,
} from "firebase/firestore";

/**
 * Subscribes to real-time updates of a user's cart items
 *
 * @param userId - The ID of the user whose cart to monitor
 * @param onCartUpdate - Callback function called when cart items change
 * @param onError - Optional callback function called when an error occurs
 * @returns Unsubscribe function to stop listening to updates
 *
 * @example
 * ```typescript
 * const unsubscribe = subscribeToCart(
 *   userId,
 *   (items) => setCartItems(items),
 *   (error) => console.error('Cart error:', error)
 * );
 *
 * // Later, stop listening
 * unsubscribe();
 * ```
 */
export const subscribeToCart = (
  userId: string,
  onCartUpdate: (items: CartItem[]) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  const cartItemsRef = collection(firestore, "carts", userId, "items");
  const cartQuery = query(cartItemsRef, orderBy("createdAt", "desc"));

  return onSnapshot(
    cartQuery,
    (snapshot) => {
      try {
        const items = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            // Convert Firestore timestamps to Date objects
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            selectedDate: data.selectedDate?.toDate() || undefined,
          };
        }) as CartItem[];

        onCartUpdate(items);
      } catch (error) {
        console.error("Error processing cart items:", error);
        onError?.(error instanceof Error ? error : new Error("Unknown error"));
      }
    },
    (error) => {
      console.error("Error listening to cart updates:", error);
      onError?.(error);
    }
  );
};

/**
 * Subscribes to real-time updates of a user's cart summary
 * This provides total item count and total price for display in navigation
 *
 * @param userId - The ID of the user whose cart summary to monitor
 * @param onSummaryUpdate - Callback function called when cart summary changes
 * @param onError - Optional callback function called when an error occurs
 * @returns Unsubscribe function to stop listening to updates
 *
 * @example
 * ```typescript
 * const unsubscribe = subscribeToCartSummary(
 *   userId,
 *   ({ totalItems, totalPrice }) => {
 *     setCartCount(totalItems);
 *     setCartTotal(totalPrice);
 *   },
 *   (error) => console.error('Cart summary error:', error)
 * );
 * ```
 */
export const subscribeToCartSummary = (
  userId: string,
  onSummaryUpdate: (summary: {
    totalItems: number;
    totalPrice: number;
  }) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  const cartDocRef = doc(firestore, "carts", userId);

  return onSnapshot(
    cartDocRef,
    (snapshot) => {
      try {
        const data = snapshot.data();
        onSummaryUpdate({
          totalItems: data?.totalItems || 0,
          totalPrice: data?.totalPrice || 0,
        });
      } catch (error) {
        console.error("Error processing cart summary:", error);
        onError?.(error instanceof Error ? error : new Error("Unknown error"));
      }
    },
    (error) => {
      console.error("Error listening to cart summary:", error);
      onError?.(error);
    }
  );
};
