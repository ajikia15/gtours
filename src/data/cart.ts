"use server";

/**
 * Shopping Cart Server Actions
 *
 * This file contains all server-side functions for managing shopping cart operations.
 * All functions require user authentication and handle Firestore operations.
 */

import { firestore } from "@/firebase/server";
import { CartItem } from "@/types/Cart";
import { verifyUserToken } from "@/lib/auth-utils";

// ============================================================================
// AUTHENTICATION & VALIDATION HELPERS
// ============================================================================

/**
 * Verifies user authentication and returns the user ID
 * @returns Promise<string> - The authenticated user's ID
 * @throws Error if authentication fails
 */
const verifyUser = async (): Promise<string> => {
  const verifiedToken = await verifyUserToken();
  return verifiedToken.uid;
};

/**
 * Calculates if a cart item has all required fields for booking
 * @param item - Partial cart item to validate
 * @returns boolean - True if item is complete
 */
const calculateItemCompleteness = (item: Partial<CartItem>): boolean => {
  return !!(item.selectedDate && item.travelers && item.travelers.adults >= 2);
};

// ============================================================================
// PRICING CALCULATION HELPERS
// ============================================================================

/**
 * Calculates the total price increment from selected activities
 * Fetches activity data from Firestore to ensure accurate pricing
 * @param tourId - ID of the tour
 * @param selectedActivityIds - Array of selected activity type IDs
 * @returns Promise<number> - Total price increment from activities
 */
const calculateActivityPriceIncrement = async (
  tourId: string,
  selectedActivityIds: string[]
): Promise<number> => {
  try {
    const tourDoc = await firestore.collection("tours").doc(tourId).get();
    if (!tourDoc.exists) {
      console.warn(`Tour ${tourId} not found when calculating activity prices`);
      return 0;
    }

    const tourData = tourDoc.data();
    const offeredActivities = tourData?.offeredActivities || [];

    return selectedActivityIds.reduce((total, activityId) => {
      const activity = offeredActivities.find(
        (a: any) => a.activityTypeId === activityId
      );
      if (!activity) {
        console.warn(`Activity ${activityId} not found in tour ${tourId}`);
        return total;
      }
      return total + (activity?.priceIncrement || 0);
    }, 0);
  } catch (error) {
    console.error("Error calculating activity price increment:", error);
    return 0;
  }
};

/**
 * Calculates the total price for a cart item
 * Formula: Base Price + Car Costs + Activity Increments
 *
 * Car Cost Logic:
 * - Base price includes 1 car (up to 6 people)
 * - Additional cars cost 200 GEL each for every 6 additional people
 *
 * @param basePrice - Base tour price (includes 1 car)
 * @param travelers - Traveler counts
 * @param activityPriceIncrement - Total activity price increment
 * @returns number - Total calculated price
 */
const calculateItemPrice = (
  basePrice: number,
  travelers: { adults: number; children: number; infants: number },
  activityPriceIncrement: number
): number => {
  const totalPeople = travelers.adults + travelers.children;

  // Base price is fixed and includes 1 car cost (up to 6 people)
  const baseCost = basePrice;

  // Calculate additional car costs (every 6th tourist beyond the first 6 requires +200 GEL)
  // First car (up to 6 people) is included in base price
  const additionalCars = Math.max(0, Math.floor((totalPeople - 1) / 6));
  const carCost = additionalCars * 200;

  return baseCost + carCost + activityPriceIncrement;
};

// ============================================================================
// CART OPERATIONS
// ============================================================================

/**
 * Adds a new item to the user's shopping cart
 * @param cartItemData - Cart item data to add
 * @returns Promise<{success: boolean, itemId?: string, error?: boolean, message?: string}>
 */
export const addToCart = async (cartItemData: {
  tourId: string;
  tourTitle: string;
  tourBasePrice: number;
  tourImages?: string[];
  selectedDate?: Date;
  travelers: { adults: number; children: number; infants: number };
  selectedActivities: string[];
}) => {
  try {
    const userId = await verifyUser();

    // Recalculate activity price increment from server data for security
    const activityPriceIncrement = await calculateActivityPriceIncrement(
      cartItemData.tourId,
      cartItemData.selectedActivities
    );

    // Calculate car cost
    const totalPeople =
      cartItemData.travelers.adults + cartItemData.travelers.children;
    const additionalCars = Math.max(0, Math.floor((totalPeople - 1) / 6));
    const carCost = additionalCars * 200;

    const isComplete = calculateItemCompleteness(cartItemData);
    const totalPrice = calculateItemPrice(
      cartItemData.tourBasePrice,
      cartItemData.travelers,
      activityPriceIncrement
    );

    const cartItem: Omit<CartItem, "id"> = {
      ...cartItemData,
      activityPriceIncrement,
      carCost,
      totalPrice,
      status: isComplete ? "ready" : "incomplete",
      isComplete,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add to cart subcollection
    const cartItemRef = await firestore
      .collection("carts")
      .doc(userId)
      .collection("items")
      .add(cartItem);

    // Update cart summary
    await updateCartSummary(userId);

    return { success: true, itemId: cartItemRef.id };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return {
      error: true,
      message: error instanceof Error ? error.message : "Failed to add to cart",
    };
  }
};

/**
 * Updates an existing cart item
 * @param itemId - ID of the cart item to update
 * @param updates - Partial cart item data to update
 * @returns Promise<{success: boolean, error?: boolean, message?: string}>
 */
export const updateCartItem = async (
  itemId: string,
  updates: Partial<CartItem>
) => {
  try {
    const userId = await verifyUser();

    // Calculate new completeness and price if relevant fields are updated
    if (
      updates.selectedDate ||
      updates.travelers ||
      updates.selectedActivities
    ) {
      const currentItem = await firestore
        .collection("carts")
        .doc(userId)
        .collection("items")
        .doc(itemId)
        .get();

      if (!currentItem.exists) {
        return { error: true, message: "Cart item not found" };
      }

      const currentData = currentItem.data() as CartItem;
      const updatedData = { ...currentData, ...updates };

      updates.isComplete = calculateItemCompleteness(updatedData);
      updates.status = updates.isComplete ? "ready" : "incomplete";

      if (updates.travelers || updates.selectedActivities) {
        // Recalculate activity price increment if activities changed
        let newActivityPriceIncrement = currentData.activityPriceIncrement;
        if (updates.selectedActivities) {
          newActivityPriceIncrement = await calculateActivityPriceIncrement(
            currentData.tourId,
            updates.selectedActivities
          );
        }

        // Recalculate car cost if travelers changed
        const finalTravelers = updates.travelers || currentData.travelers;
        const totalPeople = finalTravelers.adults + finalTravelers.children;
        const additionalCars = Math.max(0, Math.floor((totalPeople - 1) / 6));
        const newCarCost = additionalCars * 200;

        updates.totalPrice = calculateItemPrice(
          currentData.tourBasePrice,
          finalTravelers,
          newActivityPriceIncrement
        );

        if (updates.selectedActivities) {
          updates.activityPriceIncrement = newActivityPriceIncrement;
        }
        if (updates.travelers) {
          updates.carCost = newCarCost;
        }
      }
    }

    updates.updatedAt = new Date();

    await firestore
      .collection("carts")
      .doc(userId)
      .collection("items")
      .doc(itemId)
      .update(updates);

    // Update cart summary
    await updateCartSummary(userId);

    return { success: true };
  } catch (error) {
    console.error("Error updating cart item:", error);
    return {
      error: true,
      message:
        error instanceof Error ? error.message : "Failed to update cart item",
    };
  }
};

/**
 * Removes an item from the user's cart
 * @param itemId - ID of the cart item to remove
 * @returns Promise<{success: boolean, error?: boolean, message?: string}>
 */
export const removeFromCart = async (itemId: string) => {
  try {
    const userId = await verifyUser();

    await firestore
      .collection("carts")
      .doc(userId)
      .collection("items")
      .doc(itemId)
      .delete();

    // Update cart summary
    await updateCartSummary(userId);

    return { success: true };
  } catch (error) {
    console.error("Error removing from cart:", error);
    return {
      error: true,
      message:
        error instanceof Error ? error.message : "Failed to remove from cart",
    };
  }
};

/**
 * Retrieves the user's complete cart
 * @returns Promise<{success: boolean, cart?: Cart, error?: boolean, message?: string}>
 */
export const getUserCart = async () => {
  try {
    const userId = await verifyUser();

    const cartItemsSnapshot = await firestore
      .collection("carts")
      .doc(userId)
      .collection("items")
      .orderBy("createdAt", "desc")
      .get();

    const items = cartItemsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore timestamps to Date objects
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      selectedDate: doc.data().selectedDate?.toDate() || undefined,
    })) as CartItem[];

    const totalItems = items.length;
    const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);

    return {
      success: true,
      cart: {
        userId,
        items,
        totalItems,
        totalPrice,
        updatedAt: new Date(),
      },
    };
  } catch (error) {
    console.error("Error getting cart:", error);
    return {
      error: true,
      message: error instanceof Error ? error.message : "Failed to get cart",
    };
  }
};

/**
 * Clears all items from the user's cart
 * @returns Promise<{success: boolean, error?: boolean, message?: string}>
 */
export const clearCart = async () => {
  try {
    const userId = await verifyUser();

    const cartItemsSnapshot = await firestore
      .collection("carts")
      .doc(userId)
      .collection("items")
      .get();

    const batch = firestore.batch();
    cartItemsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    // Update cart summary
    await updateCartSummary(userId);

    return { success: true };
  } catch (error) {
    console.error("Error clearing cart:", error);
    return {
      error: true,
      message: error instanceof Error ? error.message : "Failed to clear cart",
    };
  }
};

/**
 * Reorders cart items by updating their order field
 * @param itemIds - Array of cart item IDs in the desired order
 * @returns Promise<{success: boolean, error?: boolean, message?: string}>
 */
export const reorderCartItems = async (itemIds: string[]) => {
  try {
    const userId = await verifyUser();

    const batch = firestore.batch();

    // Update each item with its new order index
    itemIds.forEach((itemId, index) => {
      const itemRef = firestore
        .collection("carts")
        .doc(userId)
        .collection("items")
        .doc(itemId);

      batch.update(itemRef, {
        order: index,
        updatedAt: new Date(),
      });
    });

    await batch.commit();

    return { success: true };
  } catch (error) {
    console.error("Error reordering cart items:", error);
    return {
      error: true,
      message:
        error instanceof Error ? error.message : "Failed to reorder items",
    };
  }
};

// ============================================================================
// INTERNAL HELPERS
// ============================================================================

/**
 * Updates the cart summary document with current totals
 * This is called automatically after cart operations
 * @param userId - ID of the user whose cart to update
 */
const updateCartSummary = async (userId: string): Promise<void> => {
  try {
    const cartItemsSnapshot = await firestore
      .collection("carts")
      .doc(userId)
      .collection("items")
      .get();

    const items = cartItemsSnapshot.docs.map((doc) => doc.data()) as CartItem[];
    const totalItems = items.length;
    const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);

    await firestore.collection("carts").doc(userId).set(
      {
        userId,
        totalItems,
        totalPrice,
        updatedAt: new Date(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error updating cart summary:", error);
    // Don't throw here as this is an internal operation
  }
};
