"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function NavShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "bg-background fixed top-0 z-50 w-full transition-shadow",
        scrolled && "border-b"
      )}
    >
      {children}
    </nav>
  );
}
