/**
 * Shopping Cart Types
 *
 * This file contains all TypeScript type definitions for the shopping cart functionality.
 * It includes cart items, cart state, and related enums.
 */

/** Status of a cart item in the booking process */
export type CartItemStatus = "incomplete" | "ready" | "booked";

/**
 * Represents a single item in the shopping cart
 * Contains all booking details, pricing, and metadata for a tour
 */
export type CartItem = {
  /** Unique identifier for the cart item */
  id: string;

  // Tour Information
  /** ID of the tour this cart item represents */
  tourId: string;
  /** Display title of the tour */
  tourTitle: string;
  /** Base price of the tour (includes 1 car for up to 6 people) */
  tourBasePrice: number;
  /** Array of tour image URLs */
  tourImages?: string[];

  // Booking Details
  /** Selected date for the tour (optional until booking is complete) */
  selectedDate?: Date;
  /** Number of travelers by category */
  travelers: {
    /** Number of adult travelers (minimum 2 required) */
    adults: number;
    /** Number of child travelers */
    children: number;
    /** Number of infant travelers (don't count toward car capacity) */
    infants: number;
  };
  /** Array of selected activity type IDs */
  selectedActivities: string[];

  // Pricing Breakdown
  /** Final calculated total price including all costs */
  totalPrice: number;
  /** Additional cost from selected activities */
  activityPriceIncrement: number;
  /** Additional cost for extra cars (hidden from user) */
  carCost: number;

  // Status and Metadata
  /** Current status of the cart item */
  status: CartItemStatus;
  /** When the cart item was created */
  createdAt: Date;
  /** When the cart item was last updated */
  updatedAt: Date;

  // Validation
  /** Whether the cart item has all required fields for booking */
  isComplete: boolean;
};

/**
 * Represents the complete shopping cart for a user
 * Contains all cart items and summary information
 */
export type Cart = {
  /** ID of the user who owns this cart */
  userId: string;
  /** Array of all cart items */
  items: CartItem[];
  /** Total number of items in cart */
  totalItems: number;
  /** Total price of all items in cart */
  totalPrice: number;
  /** When the cart was last updated */
  updatedAt: Date;
};
