/** Status of a cart item in the booking process */
export type CartItemStatus = "incomplete" | "ready" | "booked";

/**
 * Represents a single item in the shopping cart
 * Contains all booking details, pricing, and metadata for a tour
 */
export type CartItem = {
  id: string;

  tourId: string;
  tourTitle: string;
  tourBasePrice: number;
  tourImages?: string[];

  // Booking Details
  selectedDate?: Date;
  travelers: {
    adults: number;
    children: number;
    infants: number;
  };
  selectedActivities: string[];

  totalPrice: number;
  activityPriceIncrement: number;
  carCost: number;

  status: CartItemStatus;
  createdAt: Date;
  updatedAt: Date;

  /** Custom order for drag and drop reordering */
  order?: number;

  /** Whether the cart item has all required fields for booking */
  isComplete: boolean;
};

/**
 * Represents the complete shopping cart for a user
 */
export type Cart = {
  userId: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  updatedAt: Date;
};
