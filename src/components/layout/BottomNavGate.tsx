"use client";
import { useEffect, useState } from "react";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export default function BottomNavGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [visible, setVisible] = useState(!isHome);

  useEffect(() => {
    if (!isHome) {
      setVisible(true);
      return;
    }
    const target = document.getElementById("popular-tours");
    if (!target) {
      setVisible(true);
      return;
    }
    const onScroll = () =>
      setVisible(target.getBoundingClientRect().top <= window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 bg-background border-t shadow-xl transition-transform duration-300",
        visible ? "translate-y-0" : "translate-y-full"
      )}
    >
      {children}
    </div>
  );
}
