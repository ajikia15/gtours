/**
 * Bank of Georgia Payment Utilities
 *
 * Helper functions for BOG payment integration that don't require server-side execution
 */

import type { BOGBasketItem } from "@/types/BOG";

/**
 * Helper function to convert cart items to BOG basket format
 */
export function cartItemsToBOGBasket(cartItems: any[]): {
  basket: BOGBasketItem[];
  totalAmount: number;
} {
  const basket = cartItems.map((item, index) => ({
    product_id: item.tourId || `tour-${index}`,
    description: item.tourTitle || "Tour Package",
    quantity: 1,
    unit_price: item.totalPrice || 0,
    total_price: item.totalPrice || 0,
    image: item.tourImages?.[0],
  }));

  const totalAmount = basket.reduce(
    (sum, item) => sum + (item.total_price || 0),
    0
  );

  return { basket, totalAmount };
}

/**
 * Helper function to mask email for privacy
 */
export function maskEmail(email: string): string {
  const [username, domain] = email.split("@");
  if (username.length <= 3) {
    return `${username[0]}***@${domain}`;
  }
  return `${username.slice(0, 2)}***${username.slice(-1)}@${domain}`;
}

/**
 * Helper function to mask phone number for privacy
 */
export function maskPhone(phone: string): string {
  // Remove non-digits
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 6) {
    return "***";
  }
  return `${digits.slice(0, 2)}***${digits.slice(-2)}`;
}
