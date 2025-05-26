"use client";

/**
 * Booking Context Provider
 *
 * This file provides a React context for managing booking-related functions across the application.
 * It centralizes pricing calculations, validation logic, and cart operations to ensure consistency
 * and reusability across different components.
 */

import { createContext, useContext } from "react";
import { Tour } from "@/types/Tour";
import {
  TravelerCounts,
  BookingSelection,
  PricingBreakdown,
  BookingValidation,
} from "@/types/Booking";
import { addToCart } from "@/data/cart";
import { useAuth } from "./auth";
import { toast } from "sonner";

/**
 * Type definition for the booking context value
 */
type BookingContextType = {
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
    booking: BookingSelection
  ) => Promise<{ success: boolean; message?: string }>;

  // Utility functions
  getTotalPeople: (travelers: TravelerCounts) => number;
  getPayingPeople: (travelers: TravelerCounts) => number; // Adults + children (infants don't pay)
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
   * Add a booking to the user's cart
   * @param tour - The tour object
   * @param booking - Complete booking selection
   * @returns Promise with success status and optional message
   */
  const addBookingToCart = async (
    tour: Tour,
    booking: BookingSelection
  ): Promise<{ success: boolean; message?: string }> => {
    if (!auth?.currentUser) {
      toast.error("Please sign in to add items to cart");
      return { success: false, message: "User not authenticated" };
    }

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
        toast.success("Tour added to cart!");
        return { success: true };
      } else {
        toast.error(result.message || "Failed to add to cart");
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMessage = "Failed to add to cart";
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
    calculateActivityPriceIncrement,
    calculateCarCost,
    calculateTotalPrice,
    getPricingBreakdown,
    validateBooking,
    isBookingComplete,
    addBookingToCart,
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
