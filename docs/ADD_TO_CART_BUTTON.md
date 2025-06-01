# AddToCartButton Component Documentation

## Overview

The `AddToCartButton` is a reusable React component that provides "Add to Cart" functionality for tours throughout the application. It automatically handles different cart states, integrates with the booking and cart contexts, and can be used in both simple and complex scenarios.

## Features

- **Smart State Detection**: Automatically detects if a tour is already in the cart
- **Change Detection**: Optional support for detecting changes in complex booking forms
- **Multiple States**: Handles "Add to Cart", "Update in Cart", and "View in Cart" states
- **Flexible Styling**: Accepts custom className and button variants
- **Server Component Compatible**: Can be used in server components since it's a client component

## Usage

### Basic Usage (Simple)

For simple scenarios like tour cards:

```tsx
import AddToCartButton from "@/components/add-to-cart-button";

<AddToCartButton tour={tour} className="w-full" variant="outline" />;
```

### Advanced Usage (With Change Detection)

For complex booking forms with change detection:

```tsx
import AddToCartButton from "@/components/add-to-cart-button";
import { useCartChanges } from "@/hooks/use-cart-changes";

function BookingForm({ tour }) {
  const [selectedActivities, setSelectedActivities] = useState([]);
  const { selectedDate, travelers } = useBooking().sharedState;

  const { initialState, resetInitialState } = useCartChanges({
    selectedDate,
    travelers,
    selectedActivities,
  });

  return (
    <AddToCartButton
      tour={tour}
      selectedActivities={selectedActivities}
      className="w-full"
      variant="outline"
      detectChanges={true}
      initialState={initialState}
      onUpdateSuccess={resetInitialState}
    />
  );
}
```

## Props API

| Prop                 | Type           | Required | Default     | Description                        |
| -------------------- | -------------- | -------- | ----------- | ---------------------------------- |
| `tour`               | `Tour`         | ✅       | -           | The tour object to add to cart     |
| `selectedActivities` | `string[]`     | ❌       | `[]`        | Array of selected activity IDs     |
| `className`          | `string`       | ❌       | -           | Custom CSS classes                 |
| `variant`            | Button variant | ❌       | `"outline"` | Button style variant               |
| `size`               | Button size    | ❌       | `"default"` | Button size                        |
| `showIcon`           | `boolean`      | ❌       | `true`      | Whether to show cart icon          |
| `detectChanges`      | `boolean`      | ❌       | `false`     | Enable change detection for forms  |
| `initialState`       | `InitialState` | ❌       | -           | Initial state for change detection |
| `onUpdateSuccess`    | `() => void`   | ❌       | -           | Callback after successful update   |

## Button States

The component automatically renders different button states based on context:

### 1. Add to Cart

- **When**: Tour is not in cart
- **Behavior**: Adds tour to cart using `booking.addPartialBookingToCart()`
- **Text**: "Add to Cart" / "Adding..."

### 2. Update in Cart

- **When**: Tour is in cart AND changes detected (if `detectChanges` is true)
- **Behavior**: Updates existing cart item with new details
- **Text**: "Update in Cart" / "Updating..."

### 3. View in Cart

- **When**: Tour is in cart AND no changes detected
- **Behavior**: Navigates to cart page
- **Text**: "View in Cart"

## Integration with Contexts

The component integrates with several contexts:

- **`useBooking()`**: For shared state (date, travelers) and cart operations
- **`useCart()`**: For checking existing cart items
- **`useAuth()`**: Authentication is handled internally by booking context

## Change Detection

When `detectChanges` is enabled, the component compares current form state with initial state to determine if the user has made changes. This is useful for complex booking forms where you want to show "Update" instead of "Add" when changes are made.

### Using with useCartChanges Hook

```tsx
import { useCartChanges } from "@/hooks/use-cart-changes";

const { initialState, resetInitialState } = useCartChanges({
  selectedDate,
  travelers,
  selectedActivities,
});

// Pass initialState and resetInitialState to AddToCartButton
```

## Examples

### Simple Tour Card

```tsx
<AddToCartButton tour={tour} className="w-full" variant="outline" />
```

### Booking Form with Activities

```tsx
<AddToCartButton
  tour={tour}
  selectedActivities={selectedActivityIds}
  className="w-full"
  variant="brandred"
  detectChanges={true}
  initialState={initialState}
  onUpdateSuccess={resetInitialState}
/>
```

### Custom Styling

```tsx
<AddToCartButton
  tour={tour}
  className="my-custom-class"
  variant="secondary"
  size="lg"
  showIcon={false}
/>
```

## Error Handling

The component includes built-in error handling:

- Authentication errors are handled by the booking context
- Network errors are logged to console
- Loading states are managed internally
- Toast notifications are shown by the booking context

## Dependencies

- React hooks (useState, useMemo)
- Next.js navigation
- Booking context (`useBooking`)
- Cart context (`useCart`)
- UI components (Button from shadcn/ui)
- Lucide React icons

## Migration from Old Implementation

If you're migrating from the old hardcoded cart buttons:

### Before

```tsx
<Button onClick={handleCartAction} disabled={isAddingToCart}>
  <ShoppingCart className="size-4" />
  {isAddingToCart ? "Adding..." : "Add to Cart"}
</Button>
```

### After

```tsx
<AddToCartButton tour={tour} selectedActivities={selectedActivities} />
```

This migration removes the need for:

- Local `isAddingToCart` state
- `handleCartAction` function
- Complex button state logic
- Manual cart item detection
- Error handling code

The new component handles all of this internally while providing the same functionality.
