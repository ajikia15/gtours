# BookingBar Component Documentation

## Overview

The `BookingBar` component is a comprehensive booking interface that provides a unified way to create new bookings and edit existing cart items. It features a compact popover-based design with four main selection areas: tour selection, activities, date picker, and traveler selection.

## Features

- **Dual Mode Operation**: Supports both "add" (new booking) and "edit" (modify existing) modes
- **Popover Interface**: Compact design with only one popover active at a time
- **Shared State Integration**: Integrates with the booking context for synchronized date/traveler state
- **Real-time Pricing**: Calculates and displays pricing breakdown automatically
- **Validation**: Built-in validation with error display
- **Tour Pre-selection**: Supports pre-filled tour selection with disabled tour selector
- **Activity Management**: Dynamic activity selection based on selected tour
- **Responsive Design**: Works across different screen sizes

## Installation & Dependencies

The component requires the following dependencies:

```bash
# Core dependencies (already in project)
npm install lucide-react sonner

# shadcn/ui components
npx shadcn-ui@latest add button card badge popover
```

## Basic Usage

### Add Mode (New Booking)

```tsx
import BookingBar from "@/components/booking-bar";
import { getTours } from "@/data/tours";

export default async function BookingPage() {
  const tours = await getTours();

  return (
    <BookingBar
      tours={tours}
      mode="add"
      onSuccess={() => {
        // Handle successful booking
        router.push("/cart");
      }}
    />
  );
}
```

### Edit Mode (Modify Existing)

```tsx
import BookingBar from "@/components/booking-bar";
import { useCart } from "@/context/cart";

export default function EditBookingPage({ itemId }: { itemId: string }) {
  const cart = useCart();
  const editingItem = cart.items?.find((item) => item.id === itemId);

  return (
    <BookingBar
      tours={tours}
      mode="edit"
      editingItem={editingItem}
      onSuccess={() => {
        router.push("/cart");
      }}
    />
  );
}
```

### Pre-selected Tour

```tsx
<BookingBar
  tours={tours}
  mode="add"
  preselectedTour={selectedTour}
  onSuccess={handleSuccess}
/>
```

## Props API

### BookingBarProps

| Prop              | Type              | Required | Default | Description                                         |
| ----------------- | ----------------- | -------- | ------- | --------------------------------------------------- |
| `tours`           | `Tour[]`          | ✅       | -       | Available tours to select from                      |
| `mode`            | `"add" \| "edit"` | ❌       | `"add"` | Operation mode                                      |
| `editingItem`     | `CartItem`        | ❌       | -       | Cart item to edit (required when mode is "edit")    |
| `preselectedTour` | `Tour`            | ❌       | -       | Pre-selected tour (optional, for add mode)          |
| `onSuccess`       | `() => void`      | ❌       | -       | Callback when booking is successfully added/updated |
| `className`       | `string`          | ❌       | `""`    | Custom styling classes                              |

### Tour Type

```typescript
interface Tour {
  id: string;
  title: string;
  basePrice: number;
  duration: number;
  offeredActivities?: Activity[];
  // ... other tour properties
}
```

### CartItem Type

```typescript
interface CartItem {
  id: string;
  tourId: string;
  tourTitle: string;
  selectedDate: Date;
  travelers: TravelerCounts;
  selectedActivities: string[];
  totalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
  // ... other cart item properties
}
```

## Component Structure

### Main Sections

1. **Header**: Shows mode (Create/Edit Booking) and current item info
2. **Selection Bar**: Four popover triggers for tour, activities, date, travelers
3. **Pricing Summary**: Real-time pricing breakdown
4. **Validation Errors**: Shows incomplete fields
5. **Action Buttons**: Reset and Submit buttons

### Popover Management

The component uses a single state management system to ensure only one popover is open at a time:

```typescript
type PopoverType = "tour" | "activities" | "date" | "travelers";
const [activePopover, setActivePopover] = useState<PopoverType | null>(null);
```

## Integration Patterns

### Server Component Pattern

```tsx
// page.tsx (Server Component)
import { getTours } from "@/data/tours";
import BookingPageClient from "./booking-page-client";

export default async function BookingPage() {
  const tours = await getTours();

  return <BookingPageClient tours={tours} />;
}

// booking-page-client.tsx (Client Component)
("use client");
import BookingBar from "@/components/booking-bar";

export default function BookingPageClient({ tours }: { tours: Tour[] }) {
  return (
    <BookingBar
      tours={tours}
      mode="add"
      onSuccess={() => router.push("/cart")}
    />
  );
}
```

### Quick Booking Header

```tsx
export default function Header() {
  const [showQuickBooking, setShowQuickBooking] = useState(false);

  return (
    <header>
      {showQuickBooking ? (
        <BookingBar
          tours={tours}
          mode="add"
          className="border-0 shadow-none"
          onSuccess={() => setShowQuickBooking(false)}
        />
      ) : (
        <Button onClick={() => setShowQuickBooking(true)}>Quick Book</Button>
      )}
    </header>
  );
}
```

### Cart Edit Integration

```tsx
// cart-card.tsx
import { useRouter } from "next/navigation";

export default function CartCard({ item }: { item: CartItem }) {
  const router = useRouter();

  return (
    <Card>
      {/* ... cart item display ... */}
      <Button
        onClick={() => router.push(`/cart/edit/${item.id}`)}
        variant="outline"
        size="sm"
      >
        <Edit3 className="h-4 w-4 mr-2" />
        Edit
      </Button>
    </Card>
  );
}
```

## State Management

### Shared State Integration

The component integrates with the booking context for shared state:

```typescript
const booking = useBooking();
const { selectedDate, travelers } = booking.sharedState;

// Update shared state
booking.updateSharedDate(newDate);
booking.updateSharedTravelers(newTravelers);
```

### Local State

```typescript
const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
const [selectedActivities, setSelectedActivities] = useState<Set<string>>(
  new Set()
);
const [activePopover, setActivePopover] = useState<PopoverType | null>(null);
```

## Validation

The component uses the booking context validation system:

```typescript
const validation = booking.validateBooking({
  selectedDate,
  travelers,
  selectedActivities: Array.from(selectedActivities),
});

// validation.isComplete - boolean
// validation.errors - string[]
```

## Pricing

Real-time pricing calculation with breakdown:

```typescript
const totalPrice = booking.calculateTotalPrice(
  selectedTour,
  travelers,
  Array.from(selectedActivities)
);

const pricingBreakdown = booking.getPricingBreakdown(
  selectedTour,
  travelers,
  Array.from(selectedActivities)
);
```

## Error Handling

### Common Issues and Solutions

1. **"Cannot read properties of undefined"**

   - Ensure tours array is loaded before rendering
   - Add null checks for tour data

2. **"Maximum update depth exceeded"**

   - Avoid including 'booking' in useEffect dependencies
   - Use specific booking properties instead

3. **Activities not loading**
   - Ensure `offeredActivities` exists on tour object
   - Add fallback empty array: `tour.offeredActivities || []`

### Safety Checks

```typescript
// Safe tour lookup
const tour = tours.find((t) => t.id === tourId);
if (!tour) return;

// Safe activities access
const activities = selectedTour?.offeredActivities || [];

// Safe cart item lookup
const editingItem = cart.items?.find((item) => item.id === itemId);
if (!editingItem && mode === "edit") {
  // Handle missing item
}
```

## Styling

### Default Styling

The component uses Tailwind CSS with shadcn/ui components:

```tsx
<Card className={cn("p-6", className)}>{/* Component content */}</Card>
```

### Custom Styling

```tsx
<BookingBar tours={tours} className="border-0 shadow-none bg-transparent" />
```

### Responsive Design

The component is responsive by default:

```tsx
<div className="flex flex-wrap gap-4 items-center">
  {/* Popover triggers */}
</div>
```

## Performance Considerations

1. **Tour Data**: Pass tours as props from server components
2. **Memoization**: Consider memoizing expensive calculations
3. **Popover State**: Single popover state prevents multiple renders
4. **Validation**: Validation runs only when dependencies change

## Accessibility

- Keyboard navigation support through shadcn/ui components
- Screen reader friendly with proper ARIA labels
- Focus management in popovers
- Semantic HTML structure

## Testing

### Unit Tests

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import BookingBar from "@/components/booking-bar";

test("renders tour selection", () => {
  render(<BookingBar tours={mockTours} />);
  expect(screen.getByText("Select tour")).toBeInTheDocument();
});

test("opens tour popover on click", () => {
  render(<BookingBar tours={mockTours} />);
  fireEvent.click(screen.getByText("Select tour"));
  expect(screen.getByText("Select Tour")).toBeInTheDocument();
});
```

### Integration Tests

```typescript
test("completes booking flow", async () => {
  render(<BookingBar tours={mockTours} />);

  // Select tour
  fireEvent.click(screen.getByText("Select tour"));
  fireEvent.click(screen.getByText("Test Tour"));

  // Select activities
  fireEvent.click(screen.getByText("Select activities"));
  fireEvent.click(screen.getByText("Test Activity"));

  // Select date and travelers
  // ... more interactions

  // Submit
  fireEvent.click(screen.getByText("Add to Cart"));

  await waitFor(() => {
    expect(mockOnSuccess).toHaveBeenCalled();
  });
});
```

## Migration Guide

### From Separate Components

If migrating from separate booking components:

1. Replace individual components with BookingBar
2. Update state management to use shared booking context
3. Migrate validation logic to booking context
4. Update styling to match new popover design

### Breaking Changes

- Removed individual component props
- Changed to popover-based interface
- Unified state management
- New validation system

## Examples

### Complete Implementation

See the following files for complete examples:

- `src/app/[locale]/booking/booking-page-client.tsx` - Add mode with quick booking
- `src/app/[locale]/cart/edit/[itemId]/edit-booking-page-client.tsx` - Edit mode
- `src/components/booking-bar.tsx` - Main component implementation

### Common Use Cases

1. **Tour Detail Page**: Pre-select tour, allow activity/date/traveler selection (supports partial bookings)
2. **General Booking Page**: Full tour selection capability (requires complete validation)
3. **Cart Edit**: Modify existing bookings with tour locked
4. **Quick Booking**: Compact header integration
5. **Mobile Booking**: Responsive popover interface

### Partial Booking Support

The tour detail pages support partial bookings through the `addPartialBookingToCart` function:

```tsx
// In tour-details-booker.tsx
const result = await booking.addPartialBookingToCart(
  tour,
  Array.from(selectedActivities)
);
```

This allows users to add tours to cart without completing all required fields (date, travelers), which can be filled in later through the cart edit functionality.

## Related Documentation

- [Booking Context](./BOOKING_CONTEXT.md) - Shared state management
- [Shopping Cart](./SHOPPING_CART.md) - Cart integration
- [Shared Booking State](./SHARED_BOOKING_STATE.md) - State synchronization

## Support

For issues or questions:

1. Check the error handling section above
2. Review the integration patterns
3. Ensure all dependencies are properly installed
4. Verify tour data structure matches expected format
