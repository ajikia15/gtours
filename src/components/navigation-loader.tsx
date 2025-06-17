"use client";

import { usePathname } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { LoadingAnimation } from "@/components/ui/loading-animation";

export function NavigationLoader() {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Reset navigation state when pathname changes
    setIsNavigating(false);
  }, [pathname]);

  useEffect(() => {
    // Listen for link clicks to detect navigation start
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");

      if (
        link &&
        link.href &&
        !link.href.startsWith("#") &&
        !link.href.startsWith("mailto:") &&
        !link.href.startsWith("tel:")
      ) {
        // Only show loading for internal navigation
        const isInternal =
          link.href.includes(window.location.origin) ||
          link.href.startsWith("/");
        if (isInternal) {
          setIsNavigating(true);
        }
      }
    };

    document.addEventListener("click", handleLinkClick);
    return () => document.removeEventListener("click", handleLinkClick);
  }, []);

  if (isNavigating) {
    return (
      <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center">
        <LoadingAnimation
          message="Loading page..."
          size="lg"
          variant="spinner"
        />
      </div>
    );
  }

  return null;
}
