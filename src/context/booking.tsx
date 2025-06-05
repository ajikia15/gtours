"use client";

/**
 * Booking Context Provider
 *
 * This file provides a React context for managing shared booking state across the application.
 * It handles shared travel details (date, travelers) that persist across all tours,
 * while keeping tour-specific details (activities) separate.
 */

import { createContext, useContext, useState, useEffect } from "react";
import { Tour } from "@/types/Tour";
import {
  TravelerCounts,
  BookingSelection,
  PricingBreakdown,
  BookingValidation,
} from "@/types/Booking";
import { addToCart, updateCartItem } from "@/data/cart";
import { useAuth } from "./auth";
import { useCart } from "./cart";
import { toast } from "sonner";

/**
 * Shared booking state that persists across all tours
 */
type SharedBookingState = {
  selectedDate: Date | undefined;
  travelers: TravelerCounts;
};

/**
 * Type definition for the booking context value
 */
type BookingContextType = {
  // Shared state management
  sharedState: SharedBookingState;
  updateSharedDate: (date: Date | undefined) => void;
  updateSharedTravelers: (travelers: TravelerCounts) => void;
  resetSharedState: () => void;

  // Pricing calculations
  calculateActivityPriceIncrement: (
    tour: Tour,
    selectedActivityIds: string[]
  ) => number;
  calculateCarCost: (totalPeople: number) => number;
  calculateTotalPrice: (
    tour: Tour,
    travelers: TravelerCounts,
    selectedActivityIds: string[]
  ) => number;
  getPricingBreakdown: (
    tour: Tour,
    travelers: TravelerCounts,
    selectedActivityIds: string[]
  ) => PricingBreakdown;

  // Validation
  validateBooking: (booking: Partial<BookingSelection>) => BookingValidation;
  isBookingComplete: (booking: Partial<BookingSelection>) => boolean;

  // Cart operations
  addBookingToCart: (
    tour: Tour,
    selectedActivities: string[]
  ) => Promise<{ success: boolean; message?: string }>;
  addPartialBookingToCart: (
    tour: Tour,
    selectedActivities: string[]
  ) => Promise<{ success: boolean; message?: string }>;

  // Direct checkout functionality
  proceedToDirectCheckout: (
    tour: Tour,
    selectedActivities: string[]
  ) => Promise<{ success: boolean; checkoutUrl?: string; message?: string }>;

  // Utility functions
  getTotalPeople: (travelers: TravelerCounts) => number;
  getPayingPeople: (travelers: TravelerCounts) => number;
};

/**
 * React context for booking functions
 */
const BookingContext = createContext<BookingContextType | null>(null);

/**
 * Booking Provider Component
 *
 * Wraps the application to provide booking functions to all child components.
 * These functions are stateless and can be used across different booking flows.
 *
 * @param children - React children to wrap with booking context
 *
 * @example
 * ```tsx
 * <BookingProvider>
 *   <App />
 * </BookingProvider>
 * ```
 */
export const BookingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const auth = useAuth();
  const cart = useCart();

  // Default shared state
  const defaultSharedState: SharedBookingState = {
    selectedDate: undefined,
    travelers: { adults: 2, children: 0, infants: 0 },
  };

  // Shared booking state
  const [sharedState, setSharedState] =
    useState<SharedBookingState>(defaultSharedState);

  // Initialize shared state from cart when cart loads
  useEffect(() => {
    if (cart.items.length > 0 && !cart.loading) {
      const firstItem = cart.items[0];
      setSharedState({
        selectedDate: firstItem.selectedDate,
        travelers: firstItem.travelers,
      });
    }
  }, [cart.items, cart.loading]);

  // Shared state management functions
  const updateSharedDate = (date: Date | undefined) => {
    setSharedState((prev) => ({ ...prev, selectedDate: date }));
  };

  const updateSharedTravelers = (travelers: TravelerCounts) => {
    setSharedState((prev) => ({ ...prev, travelers }));
  };

  const resetSharedState = () => {
    setSharedState(defaultSharedState);
  };

  // Sync cart items when shared state changes
  const syncCartWithSharedState = async () => {
    if (!auth?.currentUser || cart.items.length === 0) return;

    try {
      const updatePromises = cart.items.map((item) =>
        updateCartItem(item.id, {
          selectedDate: sharedState.selectedDate,
          travelers: sharedState.travelers,
        })
      );

      await Promise.all(updatePromises);
    } catch (error) {
      console.error("Failed to sync cart with shared state:", error);
    }
  };

  /**
   * Calculate the total price increment from selected activities
   * @param tour - The tour object containing activity data
   * @param selectedActivityIds - Array of selected activity type IDs
   * @returns Total price increment from activities
   */
  const calculateActivityPriceIncrement = (
    tour: Tour,
    selectedActivityIds: string[]
  ): number => {
    // Return 0 if tour or activities are not available
    if (
      !tour ||
      !tour.offeredActivities ||
      !Array.isArray(tour.offeredActivities)
    ) {
      return 0;
    }

    return selectedActivityIds.reduce((total, activityId) => {
      const activity = tour.offeredActivities.find(
        (a) => a.activityTypeId === activityId
      );
      return total + (activity?.priceIncrement || 0);
    }, 0);
  };

  /**
   * Calculate additional car costs based on total people
   * Base price includes 1 car for up to 6 people
   * Every additional 6 people requires another car costing 200 GEL
   * @param totalPeople - Total number of people (adults + children + infants)
   * @returns Additional car cost in GEL
   */
  const calculateCarCost = (totalPeople: number): number => {
    // Base price already includes first car (up to 6 people)
    // Additional cars needed for every 6 people beyond the first 6
    const additionalCars = Math.max(0, Math.floor((totalPeople - 1) / 6));
    return additionalCars * 200;
  };

  /**
   * Calculate the total price for a booking
   * @param tour - The tour object
   * @param travelers - Traveler counts
   * @param selectedActivityIds - Array of selected activity type IDs
   * @returns Total price in GEL
   */
  const calculateTotalPrice = (
    tour: Tour,
    travelers: TravelerCounts,
    selectedActivityIds: string[]
  ): number => {
    // Return 0 if tour data is not available
    if (!tour || typeof tour.basePrice !== "number") {
      return 0;
    }

    const totalPeople = getTotalPeople(travelers);
    const basePrice = tour.basePrice;
    const carCost = calculateCarCost(totalPeople);
    const activityCost = calculateActivityPriceIncrement(
      tour,
      selectedActivityIds
    );

    return basePrice + carCost + activityCost;
  };

  /**
   * Get detailed pricing breakdown for a booking
   * @param tour - The tour object
   * @param travelers - Traveler counts
   * @param selectedActivityIds - Array of selected activity type IDs
   * @returns Detailed pricing breakdown
   */
  const getPricingBreakdown = (
    tour: Tour,
    travelers: TravelerCounts,
    selectedActivityIds: string[]
  ): PricingBreakdown => {
    // Return default breakdown if tour data is not available
    if (!tour || typeof tour.basePrice !== "number") {
      return {
        basePrice: 0,
        carCost: 0,
        activityCost: 0,
        totalPrice: 0,
      };
    }

    const totalPeople = getTotalPeople(travelers);
    const basePrice = tour.basePrice;
    const carCost = calculateCarCost(totalPeople);
    const activityCost = calculateActivityPriceIncrement(
      tour,
      selectedActivityIds
    );
    const totalPrice = basePrice + carCost + activityCost;

    return {
      basePrice,
      carCost,
      activityCost,
      totalPrice,
    };
  };

  /**
   * Validate a booking for completeness and correctness
   * @param booking - Partial booking selection to validate
   * @returns Validation result with errors if any
   */
  const validateBooking = (
    booking: Partial<BookingSelection>
  ): BookingValidation => {
    const errors: string[] = [];

    // Check required date
    if (!booking.selectedDate) {
      errors.push("Tour date is required");
    } else if (booking.selectedDate <= new Date()) {
      errors.push("Tour date must be in the future");
    }

    // Check travelers
    if (!booking.travelers) {
      errors.push("Traveler information is required");
    } else {
      if (booking.travelers.adults < 2) {
        errors.push("Minimum 2 adults required");
      }
      if (booking.travelers.children < 0 || booking.travelers.infants < 0) {
        errors.push("Traveler counts cannot be negative");
      }
    }

    // Activities are optional, so no validation needed

    return {
      isComplete: errors.length === 0,
      errors,
    };
  };

  /**
   * Check if a booking has all required fields for completion
   * @param booking - Partial booking selection to check
   * @returns True if booking is complete
   */
  const isBookingComplete = (booking: Partial<BookingSelection>): boolean => {
    return validateBooking(booking).isComplete;
  };

  /**
   * Add a booking to the user's cart using shared state
   * @param tour - The tour object
   * @param selectedActivities - Array of selected activity IDs for this tour
   * @returns Promise with success status and optional message
   */
  const addBookingToCart = async (
    tour: Tour,
    selectedActivities: string[]
  ): Promise<{ success: boolean; message?: string }> => {
    if (!auth?.currentUser) {
      toast.error("Please sign in to add items to cart");
      return { success: false, message: "User not authenticated" };
    }

    // Create booking from shared state and tour-specific activities
    const booking: BookingSelection = {
      selectedDate: sharedState.selectedDate!,
      travelers: sharedState.travelers,
      selectedActivities,
    };

    // Validate booking before adding to cart
    const validation = validateBooking(booking);
    if (!validation.isComplete) {
      const errorMessage = `Booking incomplete: ${validation.errors.join(
        ", "
      )}`;
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }

    try {
      const result = await addToCart({
        tourId: tour.id,
        tourTitle: tour.title,
        tourBasePrice: tour.basePrice,
        tourImages: tour.images,
        selectedDate: booking.selectedDate,
        travelers: booking.travelers,
        selectedActivities: booking.selectedActivities,
      });

      if (result.success) {
        // Sync existing cart items with the new shared state
        await syncCartWithSharedState();

        toast.success(
          "Tour added to cart! All tours updated with travel details."
        );
        return { success: true };
      } else {
        toast.error(result.message || "Failed to add to cart");
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error("Error adding booking to cart:", error);
      const errorMessage = "Failed to add to cart";
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  /**
   * Add a partial booking to the user's cart (allows incomplete bookings)
   * @param tour - The tour object
   * @param selectedActivities - Array of selected activity IDs for this tour
   * @returns Promise with success status and optional message
   */
  const addPartialBookingToCart = async (
    tour: Tour,
    selectedActivities: string[]
  ): Promise<{ success: boolean; message?: string }> => {
    if (!auth?.currentUser) {
      toast.error("Please sign in to add items to cart");
      return { success: false, message: "User not authenticated" };
    }

    try {
      const result = await addToCart({
        tourId: tour.id,
        tourTitle: tour.title,
        tourBasePrice: tour.basePrice,
        tourImages: tour.images,
        selectedDate: sharedState.selectedDate,
        travelers: sharedState.travelers,
        selectedActivities: selectedActivities,
      });

      if (result.success) {
        // Sync existing cart items with the new shared state if any exist
        if (cart.items.length > 0) {
          await syncCartWithSharedState();
        }

        const validation = validateBooking({
          selectedDate: sharedState.selectedDate,
          travelers: sharedState.travelers,
          selectedActivities,
        });

        if (validation.isComplete) {
          toast.success("Tour added to cart!");
        } else {
          toast.success(
            "Tour added to cart! Complete the booking details when ready."
          );
        }
        return { success: true };
      } else {
        toast.error(result.message || "Failed to add to cart");
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error("Error adding partial booking to cart:", error);
      const errorMessage = "Failed to add to cart";
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };
  /**
   * Proceed directly to checkout with a single tour
   * This checks if tour exists in cart and updates it, or adds it if not present
   * @param tour - The tour object
   * @param selectedActivities - Array of selected activity IDs for this tour
   * @returns Promise with success status, checkout URL, and optional message
   */
  const proceedToDirectCheckout = async (
    tour: Tour,
    selectedActivities: string[]
  ): Promise<{ success: boolean; checkoutUrl?: string; message?: string }> => {
    if (!auth?.currentUser) {
      toast.error("Please sign in to continue");
      return { success: false, message: "User not authenticated" };
    }

    try {
      // Check if tour already exists in cart
      const existingCartItem = cart.items.find(
        (item) => item.tourId === tour.id
      );

      let cartResult;

      if (existingCartItem) {
        // Update existing cart item instead of adding duplicate
        const { updateCartItem } = await import("@/data/cart");

        cartResult = await updateCartItem(existingCartItem.id, {
          selectedDate: sharedState.selectedDate,
          travelers: sharedState.travelers,
          selectedActivities: selectedActivities,
        });

        if (cartResult.success) {
          toast.success("Tour updated and proceeding to checkout...");
        }
      } else {
        // Add new item to cart
        cartResult = await addPartialBookingToCart(tour, selectedActivities);
      }

      if (!cartResult.success) {
        return {
          success: false,
          message: cartResult.message || "Failed to prepare tour for checkout",
        };
      }

      // Generate checkout URL with the specific tour item
      const checkoutUrl = `/account/checkout?directTour=${tour.id}`;

      return {
        success: true,
        checkoutUrl,
        message: "Redirecting to checkout...",
      };
    } catch (error) {
      console.error("Error in direct checkout:", error);
      const errorMessage = "Failed to proceed to checkout";
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  /**
   * Get total number of people (adults + children + infants)
   * @param travelers - Traveler counts
   * @returns Total number of people
   */
  const getTotalPeople = (travelers: TravelerCounts): number => {
    return travelers.adults + travelers.children + travelers.infants;
  };

  /**
   * Get number of paying people (adults + children, infants don't pay)
   * @param travelers - Traveler counts
   * @returns Number of paying people
   */
  const getPayingPeople = (travelers: TravelerCounts): number => {
    return travelers.adults + travelers.children;
  };

  const contextValue: BookingContextType = {
    // Shared state management
    sharedState,
    updateSharedDate,
    updateSharedTravelers,
    resetSharedState,

    // Pricing calculations
    calculateActivityPriceIncrement,
    calculateCarCost,
    calculateTotalPrice,
    getPricingBreakdown,

    // Validation
    validateBooking,
    isBookingComplete,

    // Cart operations
    addBookingToCart,
    addPartialBookingToCart,

    // Direct checkout functionality
    proceedToDirectCheckout,

    // Utility functions
    getTotalPeople,
    getPayingPeople,
  };

  return (
    <BookingContext.Provider value={contextValue}>
      {children}
    </BookingContext.Provider>
  );
};

/**
 * Hook to access booking context
 *
 * @returns BookingContextType - The booking functions and utilities
 * @throws Error if used outside of BookingProvider
 *
 * @example
 * ```tsx
 * const { calculateTotalPrice, addBookingToCart } = useBooking();
 * ```
 */
export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
