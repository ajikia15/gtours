/**
 * Booking-related type definitions
 * Centralized types for booking functionality across the application
 */

/**
 * Represents the count of travelers by category
 */
export type TravelerCounts = {
  /** Number of adult travelers (minimum 2 required) */
  adults: number;
  /** Number of child travelers (2-12 years old) */
  children: number;
  /** Number of infant travelers (0-2 years old, don't count toward car capacity) */
  infants: number;
};

/**
 * Represents a complete booking selection
 */
export type BookingSelection = {
  /** Selected tour date */
  selectedDate: Date;
  /** Traveler counts */
  travelers: TravelerCounts;
  /** Array of selected activity type IDs */
  selectedActivities: string[];
};

/**
 * Pricing breakdown for a booking
 */
export type PricingBreakdown = {
  /** Base price of the tour (fixed, includes 1 car for up to 6 people) */
  basePrice: number;
  /** Additional cost for extra cars (hidden from user) */
  carCost: number;
  /** Additional cost from selected activities */
  activityCost: number;
  /** Final total price */
  totalPrice: number;
};

/**
 * Validation result for booking completeness
 */
export type BookingValidation = {
  /** Whether the booking has all required fields */
  isComplete: boolean;
  /** Array of missing or invalid fields */
  errors: string[];
};
