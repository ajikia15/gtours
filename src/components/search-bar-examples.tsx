// Example usage file demonstrating TourSearchBar component variations
// This file shows how to implement TourSearchBar in different contexts

import { useRouter } from "@/i18n/navigation";
import TourSearchBar, { CompactTourSearch, QuickTourSearch } from "@/components/tour-search-bar";
import { Tour } from "@/types/Tour";

// Example 1: Full TourSearchBar for dedicated search pages
export function FullSearchExample({ tours }: { tours: Tour[] }) {
  const router = useRouter();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Find Your Perfect Tour</h1>
      
      <TourSearchBar
        tours={tours}
        onSearch={(filters, results) => {
          console.log("Applied filters:", filters);
          console.log("Search results:", results);
          // Handle search results - could update URL params or local state
        }}
        onTourSelect={(tour) => {
          // Navigate to tour details
          router.push(`/tour/${tour.id}`);
        }}
        className="mb-8"
      />
      
      {/* Search results would be displayed here */}
    </div>
  );
}

// Example 2: Compact TourSearchBar for headers/navigation
export function HeaderSearchExample({ tours }: { tours: Tour[] }) {
  const router = useRouter();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold">GTours</h1>
            <nav className="hidden md:flex gap-6">
              <a href="/tours">Tours</a>
              <a href="/destinations">Destinations</a>
              <a href="/about">About</a>
            </nav>
          </div>
          
          {/* Compact search in header */}
          <CompactTourSearch
            tours={tours}
            placeholder="Search tours..."
            className="max-w-md"
            onTourSelect={(tour) => router.push(`/tour/${tour.id}`)}
          />
        </div>
      </div>
    </header>
  );
}

// Example 3: Quick TourSearchBar for hero sections
export function HeroSearchExample({ tours }: { tours: Tour[] }) {
  const router = useRouter();

  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl font-bold text-white mb-4">
          Discover Georgia's Hidden Gems
        </h1>
        <p className="text-xl text-blue-100 mb-8">
          Find and book unique tours across beautiful Georgia
        </p>
        
        {/* Minimal search for hero */}
        <QuickTourSearch
          tours={tours}
          placeholder="Where do you want to explore?"
          className="max-w-2xl mx-auto"
          onSearch={(filters, results) => {
            // Navigate to search results page
            const params = new URLSearchParams();
            if (filters.destination) params.set('q', filters.destination);
            if (filters.activities.length > 0) params.set('activities', filters.activities.join(','));
            router.push(`/search?${params.toString()}`);
          }}
        />
      </div>
    </section>
  );
}

// Example 4: TourSearchBar with state management
import { useState } from "react";

export function SearchWithStateExample({ tours }: { tours: Tour[] }) {
  const [filteredTours, setFilteredTours] = useState<Tour[]>(tours);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (filters: any, results: Tour[]) => {
    setIsLoading(true);
    
    try {
      // Use the pre-filtered results from TourSearchBar
      setFilteredTours(results);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <TourSearchBar
        tours={tours}
        onSearch={handleSearch}
        onTourSelect={(tour) => router.push(`/tour/${tour.id}`)}
      />
      
      {/* Display filtered results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Searching tours...</p>
          </div>
        ) : filteredTours.length > 0 ? (
          filteredTours.map((tour) => (
            <div key={tour.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg mb-2">{tour.title[0]}</h3>
              <p className="text-gray-600 mb-4">{tour.subtitle[0]}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">
                  {tour.basePrice} GEL
                </span>
                <button
                  onClick={() => router.push(`/tour/${tour.id}`)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-600">No tours found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Example 5: TourSearchBar in a modal/drawer
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function SearchModalExample({ tours }: { tours: Tour[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Open Search
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Search Tours</DialogTitle>
        </DialogHeader>
        
        <CompactTourSearch
          tours={tours}
          onTourSelect={(tour) => {
            setIsOpen(false);
            router.push(`/tour/${tour.id}`);
          }}
          className="mt-4"
        />
      </DialogContent>
    </Dialog>
  );
}

// Example 6: Integration with existing booking flow
export function SearchToBookingExample({ tours }: { tours: Tour[] }) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Find & Book Tours</h2>
      
      <TourSearchBar
        tours={tours}
        onTourSelect={(tour) => {
          // Instead of just viewing, go directly to booking
          router.push(`/book/${tour.id}`);
        }}
        onSearch={(filters, results) => {
          // Could also navigate to a combined search/booking page
          const params = new URLSearchParams();
          if (filters.destination) params.set('destination', filters.destination);
          if (filters.activities.length > 0) params.set('activities', filters.activities.join(','));
          
          // Navigate to booking page with pre-filled search criteria
          router.push(`/booking?${params.toString()}`);
        }}
      />
      
      <div className="text-sm text-gray-600">
        <p>💡 Tip: Use the search to find tours, then book directly or add to your cart for later.</p>
      </div>
    </div>
  );
}
