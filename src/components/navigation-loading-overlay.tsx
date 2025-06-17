"use client";

import { usePathname } from "@/i18n/navigation";
import { useEffect, useState } from "react";

export function NavigationLoadingOverlay() {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Reset navigation state when pathname changes
    setIsNavigating(false);
  }, [pathname]);

  useEffect(() => {
    // Listen for Link clicks to detect navigation start
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
        // Check if it's an internal navigation
        const isInternal =
          link.href.includes(window.location.origin) ||
          link.href.startsWith("/") ||
          link.href.startsWith("?");

        // Check if it's the same page (same pathname, different search params should not show loading)
        let isSamePage = false;
        try {
          const currentUrl = new URL(window.location.href);
          let linkUrl: URL;

          // Handle relative URLs starting with ?
          if (link.href.startsWith("?")) {
            linkUrl = new URL(
              currentUrl.origin + currentUrl.pathname + link.href
            );
          } else {
            linkUrl = new URL(link.href, window.location.origin);
          }

          isSamePage = linkUrl.pathname === currentUrl.pathname;
        } catch {
          // If URL parsing fails, assume it's not the same page
          isSamePage = false;
        }

        if (isInternal && !isSamePage) {
          setIsNavigating(true);
        }
      }
    };

    // Listen for form submissions that might cause navigation
    const handleFormSubmit = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement;
      if (form && form.method !== "get") {
        setIsNavigating(true);
      }
    };

    document.addEventListener("click", handleLinkClick, true);
    document.addEventListener("submit", handleFormSubmit, true);

    return () => {
      document.removeEventListener("click", handleLinkClick, true);
      document.removeEventListener("submit", handleFormSubmit, true);
    };
  }, []);

  // Hide overlay after a maximum time to prevent it from getting stuck
  useEffect(() => {
    if (isNavigating) {
      const timeout = setTimeout(() => {
        setIsNavigating(false);
      }, 10000); // 10 second failsafe

      return () => clearTimeout(timeout);
    }
  }, [isNavigating]);
  if (!isNavigating) return null;

  return (
    <>
      <style jsx>{`
        .loader {
          width: 72px;
          height: 72px;
          position: relative;
          background: #fff;
          border-radius: 50%;
          transform: rotate(45deg);
          box-shadow: 0 0 0 10px oklch(0.57 0.231491 22.1799);
          animation: rotate 2s linear infinite;
        }
        .loader:before {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          width: 15px;
          height: 30px;
          background: oklch(0.57 0.231491 22.1799);
          transform: skew(5deg, 60deg) translate(-50%, -5%);
        }

        .loader:after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #fff;
          transform: translate(-50%, -50%);
        }

        @keyframes rotate {
          0% {
            transform: rotate(45deg);
          }
          30%,
          50%,
          70% {
            transform: rotate(230deg);
          }
          40%,
          60%,
          80% {
            transform: rotate(240deg);
          }
          100% {
            transform: rotate(245deg);
          }
        }
      `}</style>
      <div className="fixed inset-0 z-30 bg-white/80 backdrop-blur-sm flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="loader"></div>
        </div>
      </div>
    </>
  );
}
