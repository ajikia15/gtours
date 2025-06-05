"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ExpandToggle() {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    const element = document.getElementById("tour-description");
    if (element) {
      if (isExpanded) {
        element.classList.add("line-clamp-5", "overflow-hidden");
      } else {
        element.classList.remove("line-clamp-5", "overflow-hidden");
      }
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <Button
      onClick={handleToggle}
      variant="link"
      className="p-0 pt-2 font-medium text-brand-secondary hover:text-brand-secondary/80 transition-colors text-sm"
    >
      {isExpanded ? "Show Less" : "Read More..."}
    </Button>
  );
}
