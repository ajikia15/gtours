"use client";

import { useEffect, useState } from "react";
import { usePathname } from "@/i18n/navigation";

export default function NavigationProgress() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;

    const startLoading = () => {
      setIsLoading(true);
      setProgress(0);

      // Simulate progress
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 100);
    };

    const completeLoading = () => {
      setProgress(100);
      timeout = setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 200);

      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };

    // Handle link clicks
    const handleLinkClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");

      if (
        link &&
        link.href &&
        !link.href.startsWith("mailto:") &&
        !link.href.startsWith("tel:")
      ) {
        const url = new URL(link.href);
        const currentUrl = new URL(window.location.href);

        // Only show loading for different pages
        if (url.pathname !== currentUrl.pathname) {
          startLoading();
        }
      }
    };

    // Listen for clicks on the document
    document.addEventListener("click", handleLinkClick, true);

    // Complete loading when pathname changes
    completeLoading();

    return () => {
      document.removeEventListener("click", handleLinkClick, true);
      if (timeout) clearTimeout(timeout);
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [pathname]);
  if (!isLoading) return null;

  return (
    <div className="fixed top-16 left-0 w-full h-1 bg-transparent z-40">
      <div
        className="h-full bg-brand-secondary transition-all duration-200 ease-out shadow-sm"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
