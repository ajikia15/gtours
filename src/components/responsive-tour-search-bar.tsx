"use client";

import { useResponsive } from "@/hooks/use-responsive";
import TourSearchBar from "./tour-search-bar";
import MobileTourSearchBar from "./mobile-tour-search-bar";
import type { Tour } from "@/types/Tour";
import type { SearchFilters } from "@/hooks/use-tour-search";

interface ResponsiveTourSearchBarProps {
  tours: Tour[];
  onSearch?: (filters: SearchFilters, results: Tour[]) => void;
  className?: string;
}

export default function ResponsiveTourSearchBar({
  tours,
  onSearch,
  className,
}: ResponsiveTourSearchBarProps) {
  const { isMobile } = useResponsive();

  return isMobile ? (
    <MobileTourSearchBar tours={tours} onSearch={onSearch} className={className} />
  ) : (
    <TourSearchBar tours={tours} onSearch={onSearch} className={className} />
  );
}
