# SearchBar Component Documentation

## Overview

The `SearchBar` component is a comprehensive search interface for tours that matches the exact design language of the existing `BookingBar` component. It provides flexible search and filtering capabilities with multiple composition variants for different use cases.

## Key Features

- **Exact BookingBar Design**: Uses the same horizontal layout with ShadCN Popover components
- **Component Composition**: Multiple variants (Full, Compact, Quick) for different contexts
- **Advanced Filtering**: Support for destinations, activities, dates, travelers, and price range
- **Real-time Search**: Instant filtering as users type
- **Active Filter Display**: Visual badges showing applied filters with easy removal
- **Responsive Results**: Collapsible search results with detailed tour information
- **Type Safety**: Fully typed with proper Tour and OfferedActivity integration

## Architecture

### Design Consistency with BookingBar

```
[Search Input] | [Destination] | [Activities] | [Dates] | [Travelers] | [Search Button]
```

The component uses the same dark theme (`bg-zinc-900`) and popover-based interaction pattern as BookingBar, ensuring visual consistency across the application.

## Installation & Dependencies

```bash
# All dependencies are already available in the project
# Uses existing ShadCN components: Button, Card, Badge, Popover, Input
# Integrates with existing booking components: TourDatePicker, TravelerSelection
```

## Usage Examples

### Full Search Bar (Default)

```tsx
import SearchBar from "@/components/search-bar";
import { getTours } from "@/data/tours";

export default async function SearchPage() {
  const tours = await getTours();

  return (
    <SearchBar
      tours={tours}
      onSearch={(filters) => {
        console.log("Search with filters:", filters);
        // Handle search results
      }}
      onTourSelect={(tour) => {
        console.log("Selected tour:", tour);
        // Navigate to tour details or add to booking
      }}
    />
  );
}
```

### Compact Search Bar

```tsx
import { CompactSearchBar } from "@/components/search-bar";

export default function HeaderSearch() {
  return (
    <CompactSearchBar
      tours={tours}
      placeholder="Quick search..."
      onTourSelect={(tour) => router.push(`/tour/${tour.id}`)}
    />
  );
}
```

### Quick Search Bar (Minimal)

```tsx
import { QuickSearchBar } from "@/components/search-bar";

export default function HeroSearch() {
  return (
    <QuickSearchBar
      tours={tours}
      placeholder="Where do you want to go?"
      onSearch={(filters) => {
        // Handle search and navigate to results
        router.push(`/search?q=${filters.destination}`);
      }}
    />
  );
}
```

## Props API

### SearchBarProps

| Prop           | Type                               | Required | Default                    | Description                       |
| -------------- | ---------------------------------- | -------- | -------------------------- | --------------------------------- |
| `tours`        | `Tour[]`                           | ✅       | -                          | Array of tours to search through  |
| `onSearch`     | `(filters: SearchFilters) => void` | ❌       | -                          | Callback when search is performed |
| `onTourSelect` | `(tour: Tour) => void`             | ❌       | -                          | Callback when a tour is selected  |
| `className`    | `string`                           | ❌       | `""`                       | Custom styling classes            |
| `placeholder`  | `string`                           | ❌       | `"Search destinations..."` | Search input placeholder          |
| `showFilters`  | `boolean`                          | ❌       | `true`                     | Whether to show filter popovers   |
| `compactMode`  | `boolean`                          | ❌       | `false`                    | Enable compact layout             |

### SearchFilters Interface

```typescript
interface SearchFilters {
  destination?: string; // Search query for destinations
  activities: string[]; // Array of activity type IDs
  dateFrom?: Date; // Start date filter
  dateTo?: Date; // End date filter (optional)
  travelers: {
    // Traveler count requirements
    adults: number;
    children: number;
    infants: number;
  };
  priceRange?: {
    // Price filtering (future)
    min: number;
    max: number;
  };
}
```

## Component Variants

### 1. Full SearchBar (Default)

- Complete horizontal layout with all filter sections
- Collapsible search results
- Active filter badges
- Best for dedicated search pages

### 2. CompactSearchBar

- Includes filters but in compact mode
- Dropdown results overlay
- Suitable for sidebar or header integration

### 3. QuickSearchBar

- Minimal search input only
- No filter popovers
- Perfect for hero sections or quick access

## Search Logic

### Tour Filtering Algorithm

```typescript
const filteredTours = tours.filter((tour) => {
  // Text search across tour titles and activity names
  const matchesSearch = searchQuery
    ? localizedTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.offeredActivities?.some((activity) =>
        activity.nameSnapshot.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : true;

  // Activity filtering by type ID
  const matchesActivities =
    filters.activities.length === 0 ||
    filters.activities.some((activityId) =>
      tour.offeredActivities?.some(
        (offered) => offered.activityTypeId === activityId
      )
    );

  return matchesSearch && matchesActivities;
});
```

### Activity Extraction

```typescript
// Extract unique activities from all tours
const allActivities = Array.from(
  tours.reduce((acc, tour) => {
    tour.offeredActivities?.forEach((activity) => {
      acc.set(activity.activityTypeId, activity.nameSnapshot);
    });
    return acc;
  }, new Map<string, string>())
);
```

## State Management

### Local State Architecture

```typescript
// Search query state
const [searchQuery, setSearchQuery] = useState("");

// Filter state
const [filters, setFilters] = useState<SearchFilters>({
  activities: [],
  travelers: { adults: 2, children: 0, infants: 0 },
});

// UI state
const [openPopover, setOpenPopover] = useState<string | null>(null);
const [showResults, setShowResults] = useState(false);
```

### Filter Management

- **Additive Filters**: Multiple activities can be selected
- **Replaceable Filters**: Destination replaces previous selection
- **Range Filters**: Date range with optional end date
- **Clear Functionality**: Individual filter removal with X buttons

## Integration Points

### With Existing Components

```typescript
// Reuses existing booking components
import TourDatePicker from "@/components/booking/tour-date-picker";
import TravelerSelection from "@/components/booking/traveler-selection";

// Uses existing utilities
import { getLocalizedTitle } from "@/lib/localizationHelpers";
```

### With Navigation

```typescript
// Typical integration pattern
const handleTourSelect = (tour: Tour) => {
  // Option 1: Navigate to tour details
  router.push(`/tour/${tour.id}`);

  // Option 2: Add to booking flow
  router.push(`/book/${tour.id}`);

  // Option 3: Update search context
  setSelectedTour(tour);
};
```

## Styling & Theming

### Design System Alignment

```scss
// Matches BookingBar exactly
.search-bar {
  @apply bg-zinc-900 text-white;

  .section-button {
    @apply hover:bg-zinc-800 transition-colors;
  }

  .section-divider {
    @apply divide-x divide-zinc-700;
  }
}
```

### Responsive Behavior

- **Desktop**: Full horizontal layout with all sections
- **Tablet**: Maintains layout, may stack filters
- **Mobile**: Compact mode automatically activated

## Usage Patterns in GTours

### 1. Destinations Page

```tsx
// Replace existing BookingBar with SearchBar
<SearchBar
  tours={tours}
  className="my-8 max-w-4xl"
  onTourSelect={(tour) => router.push(`/tour/${tour.id}`)}
/>
```

### 2. Header Navigation

```tsx
// Quick search in header
<QuickSearchBar
  tours={tours}
  placeholder="Search tours..."
  className="max-w-md"
/>
```

### 3. Hero Section

```tsx
// Primary search interface
<FullSearchBar
  tours={tours}
  onSearch={(filters) => {
    // Filter tours and show results
    setFilteredTours(applyFilters(tours, filters));
  }}
/>
```

### 4. Carousel Overlay

```tsx
// Replace BookingBar in carousel
<CompactSearchBar
  tours={tours}
  className="absolute bottom-0 left-0 right-0"
  onTourSelect={handleTourSelection}
/>
```

## Performance Considerations

### Optimizations

1. **Memoized Filtering**: Tours are filtered only when search/filters change
2. **Debounced Search**: Can be added for real-time search optimization
3. **Lazy Loading**: Results can be paginated for large tour datasets
4. **Activity Caching**: Unique activities are extracted once and cached

### Bundle Impact

- **Minimal Addition**: Reuses existing components and utilities
- **Tree Shaking**: Unused variants are excluded from bundle
- **Shared Dependencies**: Leverages existing ShadCN and booking components

## Migration from BookingBar

### Context-Specific Replacement

```typescript
// Before: BookingBar for search
<BookingBar tours={tours} mode="add" />

// After: SearchBar for search
<SearchBar tours={tours} onTourSelect={handleSelection} />

// BookingBar remains for actual booking flows
<BookingBar tours={tours} mode="edit" editingItem={cartItem} />
```

### Component Responsibility

- **SearchBar**: Discovery, filtering, and tour selection
- **BookingBar**: Booking creation, cart management, and checkout flow

## Future Enhancements

### Planned Features

1. **Price Range Filtering**: Min/max price sliders
2. **Advanced Filters**: Duration, difficulty, group size
3. **Search History**: Recently searched terms
4. **Saved Searches**: Bookmark filter combinations
5. **Map Integration**: Geographical search with map pins
6. **Voice Search**: Speech-to-text search input
7. **Search Analytics**: Track popular searches and filters

### API Integration

```typescript
// Future server-side search endpoint
interface SearchAPI {
  searchTours(filters: SearchFilters): Promise<{
    tours: Tour[];
    facets: {
      destinations: string[];
      activities: ActivityFacet[];
      priceRange: { min: number; max: number };
    };
    total: number;
  }>;
}
```

## Testing Strategy

### Unit Tests

```typescript
describe("SearchBar", () => {
  test("filters tours by search query", () => {
    render(<SearchBar tours={mockTours} />);
    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: "skiing" },
    });
    expect(screen.getByText("Skiing Adventure")).toBeInTheDocument();
  });

  test("applies activity filters correctly", () => {
    render(<SearchBar tours={mockTours} />);
    fireEvent.click(screen.getByText("Activities"));
    fireEvent.click(screen.getByLabelText("Skiing"));
    expect(onSearch).toHaveBeenCalledWith({
      activities: ["skiing-activity-id"],
    });
  });
});
```

### Integration Tests

```typescript
test("search to booking flow", () => {
  render(<SearchBar tours={mockTours} onTourSelect={mockSelect} />);
  fireEvent.change(screen.getByPlaceholderText(/search/i), {
    target: { value: "adventure" },
  });
  fireEvent.click(screen.getByText("Search"));
  fireEvent.click(screen.getByText("Mountain Adventure"));
  expect(mockSelect).toHaveBeenCalledWith(mockTour);
});
```

## Related Documentation

- [BookingBar Component](./BOOKING_BAR.md) - Booking interface component
- [Tour Types](../types/Tour.ts) - Tour data structure
- [Activity Types](../types/Activity.ts) - Activity data structure
- [ShadCN Popover](https://ui.shadcn.com/docs/components/popover) - UI component reference

## Error Handling

### Common Issues

1. **Empty Tours Array**: Component gracefully handles empty data
2. **Missing Activity Data**: Fallback to activity type ID if name missing
3. **Locale Issues**: Defaults to English if localization fails
4. **Network Issues**: Search continues with local filtering

### Error Boundaries

```typescript
// Wrap in error boundary for production
<ErrorBoundary fallback={<SearchFallback />}>
  <SearchBar tours={tours} />
</ErrorBoundary>
```

## Accessibility

### ARIA Support

- **Search Landmark**: Proper search role and landmarks
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader**: Descriptive labels and announcements
- **Focus Management**: Proper focus trapping in popovers

### Standards Compliance

- WCAG 2.1 AA compliant
- Keyboard navigation support
- High contrast mode compatible
- Screen reader optimized
