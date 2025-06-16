"use client";

import { Link as NextIntlLink } from "@/i18n/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface LoadingLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  showLoadingFeedback?: boolean;
}

export default function LoadingLink({
  href,
  children,
  className,
  showLoadingFeedback = true,
}: LoadingLinkProps) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    if (showLoadingFeedback) {
      setIsClicked(true);
      // Reset after navigation or timeout
      setTimeout(() => setIsClicked(false), 3000);
    }
  };

  return (
    <NextIntlLink
      href={href}
      className={cn(
        className,
        isClicked && "opacity-70 cursor-wait",
        "transition-opacity duration-200"
      )}
      onClick={handleClick}
    >
      {children}
      {isClicked && showLoadingFeedback && (
        <span className="ml-2 inline-block animate-spin text-xs">⟳</span>
      )}
    </NextIntlLink>
  );
}
