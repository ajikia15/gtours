/**
 * Shared Tour Booking Hook
 * 
 * This hook provides shared booking logic that can be used across both
 * desktop and mobile booking components, eliminating code duplication
 * and ensuring consistent behavior.
 */

import { useState, useEffect, useRef } from "react";
import { Tour } from "@/types/Tour";
import { useBooking } from "@/context/booking";
import { useCart } from "@/context/cart";

interface UseTourBookingOptions {
  tour: Tour;
  initialActivities?: string[];
}

export function useTourBooking({ tour, initialActivities = [] }: UseTourBookingOptions) {
  const booking = useBooking();
  const cart = useCart();
  
  // Local state for activities (tour-specific)
  const [selectedActivities, setSelectedActivities] = useState<string[]>(initialActivities);
  
  // Track if we've initialized activities to prevent re-initialization loops
  const hasInitialized = useRef(false);

  // Shared state from booking context
  const { selectedDate, travelers } = booking.sharedState;
  
  // Check if tour is in cart
  const existingCartItem = cart.items.find((item) => item.tourId === tour.id);

  // Initialize activities from various sources - only once per tour
  useEffect(() => {
    // Skip if already initialized for this tour
    if (hasInitialized.current) return;
    
    // Get current cart item (snapshot at time of initialization)
    const currentCartItem = cart.items.find((item) => item.tourId === tour.id);
    
    // Priority 1: Existing cart item
    if (currentCartItem) {
      setSelectedActivities(currentCartItem.selectedActivities);
      hasInitialized.current = true;
      return;
    }

    // Priority 2: Temporary activities from navigation
    const { tempActivities, tempTourId } = booking.sharedState;
    if (tempActivities && tempTourId === tour.id) {
      setSelectedActivities(tempActivities);
      // Clear temp activities after using them
      setTimeout(() => booking.clearTempActivities(), 0);
      hasInitialized.current = true;
      return;
    }

    // Priority 3: Use initial activities if provided
    if (initialActivities.length > 0) {
      setSelectedActivities(initialActivities);
      hasInitialized.current = true;
      return;
    }
    
    // Mark as initialized even if no activities to set
    hasInitialized.current = true;
  }, [cart.items, booking.sharedState.tempActivities, booking.sharedState.tempTourId, tour.id, initialActivities, booking]);

  // Reset initialization flag when tour changes
  useEffect(() => {
    hasInitialized.current = false;
  }, [tour.id]);

  // Calculate pricing
  const totalPrice = booking.calculateTotalPrice(tour, travelers, selectedActivities);
  const activityCost = booking.calculateActivityPriceIncrement(tour, selectedActivities);
  const basePrice = tour.basePrice * booking.getPayingPeople(travelers);
  
  // Validation
  const validation = booking.validateBooking({
    selectedDate,
    travelers,
    selectedActivities,
  });

  // Conditional validation for different booking intents
  const validateForBookNow = () => {
    return booking.validateBooking({
      selectedDate,
      travelers,
      selectedActivities,
    });
  };

  const validateForAddToCart = () => {
    // More lenient validation for adding to cart - always allow partial bookings
    return { isComplete: true, errors: [] };
  };

  // Pricing breakdown
  const pricingBreakdown = booking.getPricingBreakdown(tour, travelers, selectedActivities);

  // Helper functions for display
  const getDateDisplay = () => {
    if (!selectedDate) return "Choose Date";
    return selectedDate.toLocaleDateString();
  };

  const getTravelersDisplay = () => {
    const total = booking.getTotalPeople(travelers);
    if (total === 0) return "Select Travelers";
    return `${total} Tourist${total !== 1 ? "s" : ""}`;
  };

  const getActivitiesDisplay = () => {
    if (selectedActivities.length === 0) return "No Activities";
    return `${selectedActivities.length} Activit${selectedActivities.length !== 1 ? "ies" : "y"}`;
  };

  const getTotalPeopleCount = () => booking.getTotalPeople(travelers);
  const getPayingPeopleCount = () => booking.getPayingPeople(travelers);

  // Booking state information
  const bookingState = {
    hasDate: selectedDate !== undefined,
    hasTravelers: travelers.adults > 0,
    hasActivities: selectedActivities.length > 0,
    isComplete: validation.isComplete,
    errors: validation.errors,
    inCart: !!existingCartItem,
  };

  // Handler functions
  const handleDateChange = (date: Date | undefined) => {
    booking.updateSharedDate(date);
  };

  const handleTravelersChange = (newTravelers: typeof travelers) => {
    booking.updateSharedTravelers(newTravelers);
  };

  const handleActivitiesChange = (activities: string[]) => {
    setSelectedActivities(activities);
  };

  // Add to cart function
  const addToCart = async () => {
    return await booking.addBookingToCart(tour, selectedActivities);
  };

  // Add partial booking to cart (with incomplete details)
  const addPartialToCart = async () => {
    return await booking.addPartialBookingToCart(tour, selectedActivities);
  };

  // Direct checkout function
  const proceedToCheckout = async () => {
    if (!validation.isComplete) {
      return { success: false, message: "Please complete all required fields" };
    }

    return await booking.proceedToDirectCheckoutWithDetails(tour, {
      selectedDate: selectedDate!,
      travelers,
      selectedActivities,
    });
  };

  return {
    // State
    selectedDate,
    travelers,
    selectedActivities,
    existingCartItem,
    
    // Calculated values
    totalPrice,
    activityCost,
    basePrice,
    pricingBreakdown,
    
    // Validation
    validation,
    validateForBookNow,
    validateForAddToCart,
    bookingState,
    
    // Display helpers
    getDateDisplay,
    getTravelersDisplay,
    getActivitiesDisplay,
    getTotalPeopleCount,
    getPayingPeopleCount,
    
    // Handlers
    handleDateChange,
    handleTravelersChange,
    handleActivitiesChange,
    
    // Actions
    addToCart,
    addPartialToCart,
    proceedToCheckout,
    
    // Booking context utilities
    booking,
    cart,
  };
}
