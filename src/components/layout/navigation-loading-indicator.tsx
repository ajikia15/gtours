"use client";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useEffect, useState } from "react";

export default function NavigationLoadingIndicator() {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Reset loading state when pathname changes
    setIsNavigating(false);
  }, [pathname]);

  // Listen for navigation start/end
  useEffect(() => {
    const handleNavigationStart = () => setIsNavigating(true);
    const handleNavigationEnd = () => setIsNavigating(false);

    // For now, we'll rely on the loading.tsx file
    // In a future version, we could add custom navigation events

    return () => {
      // Cleanup if needed
    };
  }, []);

  if (!isNavigating) return null;

  return (
    <div
      role="status"
      aria-label="Loading"
      className="fixed top-0 left-0 right-0 z-50 h-1 bg-primary/20"
    >
      <div className="h-full bg-primary animate-pulse" />
    </div>
  );
}
