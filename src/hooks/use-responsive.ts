"use client";

import { useState, useEffect } from "react";

interface WindowSize {
  width: number;
  height: number;
}

interface ResponsiveHookReturn {
  windowSize: WindowSize;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
}

/**
 * Hook that provides responsive information about the current viewport
 *
 * @returns Object with window dimensions and device type booleans
 */
export function useResponsive(): ResponsiveHookReturn {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Initialize with current window size
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Responsive breakpoints based on Tailwind defaults
  const isMobile = windowSize.width < 768; // < md
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024; // md to lg
  const isDesktop = windowSize.width >= 1024 && windowSize.width < 1280; // lg to xl
  const isLargeDesktop = windowSize.width >= 1280; // >= xl

  return {
    windowSize,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
  };
}
