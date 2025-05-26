# Booking Context Documentation

## Overview

The Booking Context provides a centralized system for managing booking-related functions across your Next.js application. It eliminates code duplication and ensures consistent pricing calculations, validation logic, and cart operations throughout your app.

## Key Benefits

✅ **No State Collisions**: Functions are stateless - each component maintains its own booking state  
✅ **Consistent Pricing**: Centralized calculations ensure accuracy across all components  
✅ **Reusable Logic**: Use the same functions in tour details, cart, checkout, etc.  
✅ **Easy Validation**: Built-in booking validation with detailed error messages  
✅ **Type Safety**: Full TypeScript support with comprehensive type definitions

## Architecture

### File Structure

```
src/
├── types/Booking.ts              # Centralized booking types
├── context/booking.tsx           # Booking context provider
├── components/booking/           # Booking-related components
│   ├── booking-summary.tsx       # Example reusable component
│   ├── tour-date-picker.tsx      # Date selection
│   ├── traveler-selection.tsx    # Traveler counts
│   └── activity-selection.tsx    # Activity selection
└── app/[locale]/layout.tsx       # Provider setup
```

### Provider Setup

The BookingProvider is already set up in your layout:

```tsx
// app/[locale]/layout.tsx
<AuthProvider>
  <CartProvider>
    <BookingProvider>{/* Your app components */}</BookingProvider>
  </CartProvider>
</AuthProvider>
```

## Available Functions

### Pricing Calculations

```tsx
const booking = useBooking();

// Calculate activity price increment
const activityCost = booking.calculateActivityPriceIncrement(
  tour,
  selectedActivityIds
);

// Calculate additional car costs (hidden from users)
const carCost = booking.calculateCarCost(totalPeople);

// Calculate total price
const totalPrice = booking.calculateTotalPrice(
  tour,
  travelers,
  selectedActivityIds
);

// Get detailed pricing breakdown
const breakdown = booking.getPricingBreakdown(
  tour,
  travelers,
  selectedActivityIds
);
// Returns: { basePrice, carCost, activityCost, totalPrice }
```

### Validation

```tsx
// Validate a booking
const validation = booking.validateBooking({
  selectedDate: new Date(),
  travelers: { adults: 2, children: 0, infants: 0 },
  selectedActivities: ["hiking", "photography"],
});

// Returns: { isComplete: boolean, errors: string[] }

// Quick completeness check
const isReady = booking.isBookingComplete(bookingData);
```

### Cart Operations

```tsx
// Add booking to cart (handles validation automatically)
const result = await booking.addBookingToCart(tour, {
  selectedDate: new Date(),
  travelers: { adults: 2, children: 1, infants: 0 },
  selectedActivities: ["hiking"],
});

// Returns: { success: boolean, message?: string }
```

### Utility Functions

```tsx
// Get total number of people
const totalPeople = booking.getTotalPeople(travelers);

// Get number of paying people (excludes infants)
const payingPeople = booking.getPayingPeople(travelers);
```

## Usage Examples

### 1. Basic Tour Booking Component

```tsx
"use client";

import { useState } from "react";
import { useBooking } from "@/context/booking";
import { Tour } from "@/types/Tour";
import { TravelerCounts } from "@/types/Booking";

export default function TourBooking({ tour }: { tour: Tour }) {
  const booking = useBooking();
  const [travelers, setTravelers] = useState<TravelerCounts>({
    adults: 2,
    children: 0,
    infants: 0,
  });
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Calculate pricing using context
  const totalPrice = booking.calculateTotalPrice(
    tour,
    travelers,
    selectedActivities
  );

  // Validate booking
  const validation = booking.validateBooking({
    selectedDate,
    travelers,
    selectedActivities,
  });

  const handleAddToCart = async () => {
    const result = await booking.addBookingToCart(tour, {
      selectedDate,
      travelers,
      selectedActivities,
    });

    if (result.success) {
      // Handle success (toast is shown automatically)
    }
  };

  return (
    <div>
      {/* Your booking form components */}

      <div className="pricing-summary">
        <p>Total: {totalPrice} GEL</p>
        {!validation.isComplete && (
          <div className="errors">
            {validation.errors.map((error, i) => (
              <p key={i} className="text-red-500">
                {error}
              </p>
            ))}
          </div>
        )}
      </div>

      <button onClick={handleAddToCart} disabled={!validation.isComplete}>
        Add to Cart
      </button>
    </div>
  );
}
```

### 2. Reusable Pricing Display

```tsx
"use client";

import { useBooking } from "@/context/booking";
import { Tour } from "@/types/Tour";
import { TravelerCounts } from "@/types/Booking";

interface PricingDisplayProps {
  tour: Tour;
  travelers: TravelerCounts;
  selectedActivities: string[];
}

export default function PricingDisplay({
  tour,
  travelers,
  selectedActivities,
}: PricingDisplayProps) {
  const booking = useBooking();

  const breakdown = booking.getPricingBreakdown(
    tour,
    travelers,
    selectedActivities
  );

  return (
    <div className="pricing-breakdown">
      <div className="flex justify-between">
        <span>Base Price:</span>
        <span>{breakdown.basePrice} GEL</span>
      </div>

      {breakdown.activityCost > 0 && (
        <div className="flex justify-between">
          <span>Activities:</span>
          <span>+{breakdown.activityCost} GEL</span>
        </div>
      )}

      {/* Car costs are hidden from users but included in total */}

      <div className="flex justify-between font-bold border-t pt-2">
        <span>Total:</span>
        <span>{breakdown.totalPrice} GEL</span>
      </div>
    </div>
  );
}
```

### 3. Quick Booking Validation

```tsx
"use client";

import { useBooking } from "@/context/booking";
import { BookingSelection } from "@/types/Booking";

export default function BookingValidator({
  booking: bookingData,
}: {
  booking: Partial<BookingSelection>;
}) {
  const booking = useBooking();

  const validation = booking.validateBooking(bookingData);

  if (validation.isComplete) {
    return <div className="text-green-600">✓ Booking is ready!</div>;
  }

  return (
    <div className="text-amber-600">
      <p>⚠ Booking incomplete:</p>
      <ul className="ml-4">
        {validation.errors.map((error, i) => (
          <li key={i}>• {error}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Type Definitions

### TravelerCounts

```typescript
type TravelerCounts = {
  adults: number; // Minimum 2 required
  children: number; // 2-12 years old
  infants: number; // 0-2 years old, don't count toward car capacity
};
```

### BookingSelection

```typescript
type BookingSelection = {
  selectedDate: Date;
  travelers: TravelerCounts;
  selectedActivities: string[];
};
```

### PricingBreakdown

```typescript
type PricingBreakdown = {
  basePrice: number; // Fixed tour price
  carCost: number; // Additional car costs (hidden from users)
  activityCost: number; // Sum of activity price increments
  totalPrice: number; // Final total
};
```

## Pricing Logic

### Base Price

- Fixed amount per tour (includes 1 car for up to 6 people)
- **Not** multiplied by number of travelers

### Car Costs (Hidden from Users)

- Additional cars needed for groups larger than 6 people
- Formula: `Math.max(0, Math.floor((totalPeople - 1) / 6))` additional cars
- Cost: 200 GEL per additional car
- Examples:
  - 1-6 people: 0 additional cars (0 GEL)
  - 7-12 people: 1 additional car (+200 GEL)
  - 13-18 people: 2 additional cars (+400 GEL)

### Activity Costs

- Each activity has an individual `priceIncrement` value
- Sum of all selected activity increments

### Total Calculation

```
Total = Base Price + Car Costs + Activity Costs
```

## Best Practices

### 1. Always Use Context Functions

```tsx
// ✅ Good - Use context functions
const totalPrice = booking.calculateTotalPrice(tour, travelers, activities);

// ❌ Bad - Duplicate calculation logic
const totalPrice = tour.basePrice + activities.reduce(...);
```

### 2. Validate Before Cart Operations

```tsx
// ✅ Good - Context handles validation automatically
await booking.addBookingToCart(tour, bookingData);

// ❌ Bad - Manual validation
if (bookingData.selectedDate && bookingData.travelers.adults >= 2) {
  await addToCart(...);
}
```

### 3. Use Type Definitions

```tsx
// ✅ Good - Use centralized types
import { TravelerCounts, BookingSelection } from "@/types/Booking";

// ❌ Bad - Define types locally
type LocalTravelers = { adults: number; children: number; infants: number };
```

### 4. Leverage Utility Functions

```tsx
// ✅ Good - Use utility functions
const totalPeople = booking.getTotalPeople(travelers);

// ❌ Bad - Manual calculation
const totalPeople = travelers.adults + travelers.children + travelers.infants;
```

## Migration Guide

If you have existing booking components, here's how to migrate:

### 1. Update Imports

```tsx
// Before
import { TravelerCounts } from "@/app/[locale]/tour/[tourId]/tour-details-booker";

// After
import { TravelerCounts } from "@/types/Booking";
import { useBooking } from "@/context/booking";
```

### 2. Replace Local Functions

```tsx
// Before
const calculateTotalPrice = () => {
  // Local calculation logic
};

// After
const booking = useBooking();
const totalPrice = booking.calculateTotalPrice(tour, travelers, activities);
```

### 3. Use Context for Cart Operations

```tsx
// Before
import { addToCart } from "@/data/cart";
await addToCart({ tourId, tourTitle, ... });

// After
await booking.addBookingToCart(tour, bookingSelection);
```

## Troubleshooting

### "useBooking must be used within a BookingProvider"

Make sure your component is wrapped by the BookingProvider in the layout.

### Pricing Calculations Don't Match

Ensure you're using the context functions instead of local calculations. The context ensures consistency with server-side pricing.

### TypeScript Errors

Import types from `@/types/Booking` instead of component-specific files.

## Future Enhancements

The booking context is designed to be extensible. Future additions might include:

- Booking persistence (save incomplete bookings)
- Multi-step booking flows
- Booking templates/favorites
- Group booking discounts
- Dynamic pricing based on date/availability
