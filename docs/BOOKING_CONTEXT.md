# Booking Context Documentation

## Overview

The Booking Context provides a centralized system for managing shared booking state and booking-related functions across your Next.js application. It implements a shared state system where travel details (date, travelers) are synchronized across all tours, while activities remain tour-specific.

## Key Benefits

✅ **Shared State Management**: Date and travelers synchronized across all tours  
✅ **Tour-Specific Activities**: Each tour maintains its own activity selections  
✅ **Automatic Synchronization**: Changes to shared details update all cart items  
✅ **Consistent Pricing**: Centralized calculations ensure accuracy across all components  
✅ **Easy Validation**: Built-in booking validation with detailed error messages  
✅ **Intuitive UX**: Natural group travel planning experience  
✅ **Type Safety**: Full TypeScript support with comprehensive type definitions

## Shared State Concept

```
User books Tour A: 5 people, March 15th, hiking activity
↓
User goes to Tour B page: Pre-filled with 5 people, March 15th
User adds photography activity → Add to cart
↓
User goes to Tour C page: Pre-filled with 5 people, March 15th
User adds wine tasting → Add to cart
↓
All tours in cart: Same group, same start date, different activities
```

## Architecture

### File Structure

```
src/
├── types/Booking.ts                    # Centralized booking types
├── context/booking.tsx                 # Booking context with shared state
├── components/booking/                 # Booking-related components
│   ├── booking-summary.tsx             # Example reusable component
│   ├── tour-date-picker.tsx            # Date selection (supports undefined)
│   ├── traveler-selection.tsx          # Traveler counts
│   └── activity-selection.tsx          # Activity selection
├── components/shared-booking-indicator.tsx  # Multi-tour guidance
└── app/[locale]/layout.tsx             # Provider setup
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

### Shared State Management

```tsx
const booking = useBooking();

// Access shared state
const { selectedDate, travelers } = booking.sharedState;

// Update shared date (affects all tours)
booking.updateSharedDate(new Date());

// Update shared travelers (affects all tours)
booking.updateSharedTravelers({ adults: 4, children: 1, infants: 0 });

// Reset shared state to defaults
booking.resetSharedState();
```

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
// Validate a booking (uses shared state internally)
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
// Add booking to cart using shared state (simplified API)
const result = await booking.addBookingToCart(tour, ["hiking", "photography"]);

// Returns: { success: boolean, message?: string }
// Note: Uses shared date/travelers automatically, syncs all cart items
```

### Utility Functions

```tsx
// Get total number of people
const totalPeople = booking.getTotalPeople(travelers);

// Get number of paying people (excludes infants)
const payingPeople = booking.getPayingPeople(travelers);
```

## Usage Examples

### 1. Modern Tour Booking Component (Shared State)

```tsx
"use client";

import { useState } from "react";
import { useBooking } from "@/context/booking";
import { Tour } from "@/types/Tour";
import SharedBookingIndicator from "@/components/shared-booking-indicator";

export default function TourBooking({ tour }: { tour: Tour }) {
  const booking = useBooking();

  // Use shared state for date and travelers
  const { selectedDate, travelers } = booking.sharedState;

  // Tour-specific activities
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  // Calculate pricing using shared state
  const totalPrice = booking.calculateTotalPrice(
    tour,
    travelers,
    selectedActivities
  );

  // Validate booking using shared state
  const validation = booking.validateBooking({
    selectedDate,
    travelers,
    selectedActivities,
  });

  const handleAddToCart = async () => {
    // Simplified API - uses shared state automatically
    const result = await booking.addBookingToCart(tour, selectedActivities);

    if (result.success) {
      // Success! All cart items updated with shared details
    }
  };

  return (
    <div>
      <SharedBookingIndicator />

      {/* Date picker updates shared state */}
      <TourDatePicker date={selectedDate} setDate={booking.updateSharedDate} />

      {/* Traveler selection updates shared state */}
      <TravelerSelection
        travelers={travelers}
        setTravelers={booking.updateSharedTravelers}
      />

      {/* Activities remain tour-specific */}
      <ActivitySelection
        activities={selectedActivities}
        setActivities={setSelectedActivities}
      />

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

### 2. Reusable Pricing Display (Updated)

```tsx
"use client";

import { useBooking } from "@/context/booking";
import { Tour } from "@/types/Tour";

interface PricingDisplayProps {
  tour: Tour;
  selectedActivities: string[];
}

export default function PricingDisplay({
  tour,
  selectedActivities,
}: PricingDisplayProps) {
  const booking = useBooking();

  // Use shared travelers for pricing
  const { travelers } = booking.sharedState;

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

### 3. Shared State Monitoring

```tsx
"use client";

import { useBooking } from "@/context/booking";
import { useCart } from "@/context/cart";

export default function BookingStatus() {
  const booking = useBooking();
  const cart = useCart();

  const { selectedDate, travelers } = booking.sharedState;
  const hasMultipleTours = cart.items.length > 1;

  return (
    <div className="booking-status">
      {hasMultipleTours && (
        <div className="shared-state-info">
          <h3>Shared Trip Details</h3>
          <p>Date: {selectedDate ? selectedDate.toDateString() : "Not set"}</p>
          <p>
            Travelers: {travelers.adults} adults, {travelers.children} children
          </p>
          <p>Applies to all {cart.items.length} tours in cart</p>
        </div>
      )}
    </div>
  );
}
```

## Type Definitions

### SharedBookingState

```typescript
type SharedBookingState = {
  selectedDate: Date | undefined;
  travelers: TravelerCounts;
};
```

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

## State Management Flow

### Initialization

1. **Empty State**: Default travelers (2 adults), no date
2. **From Cart**: If cart has items, load shared state from first item
3. **Auto-Population**: Tour pages automatically use shared state

### User Interactions

1. **Date Change**: Updates shared state → syncs all cart items
2. **Traveler Change**: Updates shared state → syncs all cart items
3. **Activity Change**: Tour-specific, doesn't affect other tours
4. **Add to Cart**: Uses shared state + tour activities

### Cart Synchronization

1. **Automatic**: When shared state changes, all cart items update
2. **Notification**: User sees "All tours updated with travel details"
3. **Consistency**: No conflicting dates/travelers across tours

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

### 1. Always Use Shared State

```tsx
// ✅ Good - Use shared state
const { selectedDate, travelers } = booking.sharedState;

// ❌ Bad - Local state for shared details
const [date, setDate] = useState(new Date());
const [travelers, setTravelers] = useState({...});
```

### 2. Use Simplified Cart API

```tsx
// ✅ Good - New simplified API
await booking.addBookingToCart(tour, selectedActivities);

// ❌ Bad - Old complex API
await booking.addBookingToCart(tour, {
  selectedDate,
  travelers,
  selectedActivities,
});
```

### 3. Show Shared State Indicators

```tsx
// ✅ Good - Show users when state is shared
<SharedBookingIndicator />

// ❌ Bad - No indication of shared behavior
```

### 4. Handle Undefined Dates

```tsx
// ✅ Good - Handle undefined dates properly
<TourDatePicker
  date={selectedDate} // Can be undefined
  setDate={booking.updateSharedDate}
/>

// ❌ Bad - Assume date is always set
```

## Migration Guide

If upgrading from the old system:

### 1. Update Tour Components

```tsx
// Before
const [date, setDate] = useState(new Date());
const [travelers, setTravelers] = useState({...});

// After
const { selectedDate, travelers } = booking.sharedState;
```

### 2. Update Cart Operations

```tsx
// Before
await booking.addBookingToCart(tour, {
  selectedDate: date,
  travelers,
  selectedActivities,
});

// After
await booking.addBookingToCart(tour, selectedActivities);
```

### 3. Add Shared State Indicators

```tsx
// Add to tour pages
<SharedBookingIndicator />
```

### 4. Update Date Picker Interface

```tsx
// Update to handle undefined dates
date: Date | undefined;
setDate: (date: Date | undefined) => void;
```

## Troubleshooting

### "useBooking must be used within a BookingProvider"

Make sure your component is wrapped by the BookingProvider in the layout.

### Shared State Not Updating

- Check if cart context is available
- Verify user authentication
- Check browser console for errors

### Cart Items Not Syncing

- Ensure `updateCartItem` function is working
- Check network connectivity
- Verify Firestore permissions

### TypeScript Errors

Import types from `@/types/Booking` and ensure components handle undefined dates.

## Future Enhancements

The shared booking state system is designed to be extensible. Future additions might include:

- Shared special requirements/notes
- Trip duration calculation
- Accommodation preferences
- Transportation preferences
- Group discount calculations
- Advanced conflict resolution
