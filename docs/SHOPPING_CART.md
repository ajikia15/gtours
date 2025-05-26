# Shopping Cart Feature Documentation

## Overview

The shopping cart feature allows authenticated users to add tours to their cart, manage booking details, and proceed to checkout. The implementation uses Firebase Firestore for real-time data synchronization and includes comprehensive pricing calculations.

## Architecture

### File Structure

```
src/
├── types/Cart.ts                    # TypeScript type definitions
├── data/cart.ts                     # Server-side cart operations
├── lib/cart-client.ts               # Client-side real-time subscriptions
├── context/cart.tsx                 # React context provider
├── components/shopping-cart.tsx     # Navigation cart icon component
├── app/[locale]/cart/page.tsx       # Cart page component
└── app/[locale]/tour/[tourId]/tour-details-booker.tsx  # Add to cart integration
```

### Data Flow

1. **User adds item to cart** → `addToCart()` server action
2. **Firestore updates** → Real-time listeners trigger
3. **Context updates** → UI re-renders automatically
4. **Cart badge updates** → Navigation shows current count

## Features

### Core Functionality

- ✅ Add tours to cart with booking details
- ✅ Real-time cart synchronization
- ✅ Complex pricing calculations
- ✅ Cart item management (update/remove)
- ✅ User authentication integration
- ✅ Responsive cart page UI

### Pricing Logic

The cart implements sophisticated pricing calculations:

#### Base Price

- Fixed price per tour (includes 1 car for up to 6 people)
- **Not** multiplied by tourist count

#### Car Costs (Hidden from Users)

- Additional cars required for groups larger than 6 people
- Formula: `Math.floor((totalPeople - 1) / 6)` additional cars
- Cost: 200 GEL per additional car
- Examples:
  - 1-6 people: 0 additional cars
  - 7-12 people: 1 additional car (+200 GEL)
  - 13-18 people: 2 additional cars (+400 GEL)

#### Activity Increments

- Each selected activity adds its price increment
- Fetched from tour data in Firestore for accuracy
- Displayed to users in price breakdown

#### Final Formula

```
Total = Base Price + Hidden Car Costs + Activity Increments
```

### Cart Item Status

Each cart item has a status indicating its readiness:

- **`incomplete`**: Missing required fields (date or minimum 2 adults)
- **`ready`**: All required fields present, ready for booking
- **`booked`**: Item has been successfully booked

## API Reference

### Server Actions (`src/data/cart.ts`)

#### `addToCart(cartItemData)`

Adds a new item to the user's cart.

**Parameters:**

- `cartItemData`: Object containing tour and booking details

**Returns:**

- `{success: boolean, itemId?: string, error?: boolean, message?: string}`

#### `updateCartItem(itemId, updates)`

Updates an existing cart item.

**Parameters:**

- `itemId`: ID of the cart item to update
- `updates`: Partial cart item data

#### `removeFromCart(itemId)`

Removes an item from the cart.

#### `getUserCart()`

Retrieves the user's complete cart.

#### `clearCart()`

Removes all items from the user's cart.

### Client Functions (`src/lib/cart-client.ts`)

#### `subscribeToCart(userId, onCartUpdate, onError?)`

Real-time subscription to cart items.

#### `subscribeToCartSummary(userId, onSummaryUpdate, onError?)`

Real-time subscription to cart summary (totals).

### React Context (`src/context/cart.tsx`)

#### `useCart()`

Hook to access cart state in components.

**Returns:**

```typescript
{
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  loading: boolean;
  error: string | null;
}
```

## Database Schema

### Firestore Collections

#### `/carts/{userId}`

Cart summary document:

```typescript
{
  userId: string;
  totalItems: number;
  totalPrice: number;
  updatedAt: Date;
}
```

#### `/carts/{userId}/items/{itemId}`

Individual cart items:

```typescript
{
  tourId: string;
  tourTitle: string;
  tourBasePrice: number;
  tourImages?: string[];
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
  status: "incomplete" | "ready" | "booked";
  isComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Security Rules

Users can only access their own cart data:

```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /carts/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /items/{itemId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

## Usage Examples

### Adding Cart Provider

```tsx
// app/layout.tsx
import { CartProvider } from "@/context/cart";

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  );
}
```

### Using Cart in Components

```tsx
// components/SomeComponent.tsx
import { useCart } from "@/context/cart";

export default function SomeComponent() {
  const { items, totalItems, loading } = useCart();

  if (loading) return <div>Loading cart...</div>;

  return (
    <div>
      <p>Cart has {totalItems} items</p>
      {items.map((item) => (
        <div key={item.id}>{item.tourTitle}</div>
      ))}
    </div>
  );
}
```

### Adding Items to Cart

```tsx
// components/TourBooking.tsx
import { addToCart } from "@/data/cart";

const handleAddToCart = async () => {
  const result = await addToCart({
    tourId: "tour-123",
    tourTitle: "Amazing Tour",
    tourBasePrice: 100,
    selectedDate: new Date(),
    travelers: { adults: 2, children: 0, infants: 0 },
    selectedActivities: ["activity-1", "activity-2"],
  });

  if (result.success) {
    toast.success("Added to cart!");
  } else {
    toast.error(result.message);
  }
};
```

## Error Handling

The cart system includes comprehensive error handling:

### Server-Side Errors

- Authentication failures
- Firestore operation errors
- Data validation errors
- Missing tour/activity data

### Client-Side Errors

- Real-time subscription failures
- Network connectivity issues
- Data parsing errors

### User-Facing Errors

- Toast notifications for failed operations
- Loading states during operations
- Graceful fallbacks for missing data

## Performance Considerations

### Optimizations Implemented

- Real-time subscriptions only for authenticated users
- Automatic cleanup of subscriptions
- Efficient Firestore queries with ordering
- Minimal re-renders through proper context structure

### Best Practices

- Use `useCallback` for cart operation handlers
- Implement proper loading states
- Handle offline scenarios gracefully
- Batch Firestore operations when possible

## Testing

### Unit Tests

- Cart calculation functions
- Data validation helpers
- Error handling scenarios

### Integration Tests

- Cart operations with Firestore
- Real-time subscription behavior
- Authentication integration

### E2E Tests

- Complete cart workflow
- Cross-browser compatibility
- Mobile responsiveness

## Future Enhancements

### Planned Features

- [ ] Cart item editing (dates, travelers, activities)
- [ ] Save for later functionality
- [ ] Cart expiration handling
- [ ] Bulk operations (select multiple items)
- [ ] Cart sharing between users
- [ ] Wishlist integration

### Performance Improvements

- [ ] Cart data caching
- [ ] Optimistic updates
- [ ] Background sync
- [ ] Pagination for large carts

## Troubleshooting

### Common Issues

#### Cart not updating in real-time

- Check Firebase authentication status
- Verify Firestore security rules
- Ensure proper subscription cleanup

#### Pricing calculations incorrect

- Verify tour data in Firestore
- Check activity price increments
- Review car cost calculation logic

#### Cart items not persisting

- Check user authentication
- Verify Firestore write permissions
- Review error logs for failed operations

### Debug Tools

```typescript
// Enable debug logging
console.log("Cart state:", useCart());
console.log("Auth state:", useAuth());
```

## Contributing

When contributing to the cart feature:

1. Follow TypeScript strict mode
2. Add comprehensive JSDoc comments
3. Include error handling for all operations
4. Write unit tests for new functions
5. Update this documentation for new features
