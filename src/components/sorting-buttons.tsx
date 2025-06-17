"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpDown, Loader2 } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

interface SortingButtonsProps {
  currentSortBy: "price" | "alphabetical";
  currentSortOrder: "asc" | "desc";
}

export default function SortingButtons({
  currentSortBy,
  currentSortOrder,
}: SortingButtonsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [loadingButton, setLoadingButton] = useState<string | null>(null);

  // Generate sorting URLs for buttons
  const generateSortUrl = (
    newSortBy: "price" | "alphabetical",
    newSortOrder?: "asc" | "desc"
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    // Set sorting params
    params.set("sortBy", newSortBy);

    // If same sort type, toggle order; otherwise use provided order or default
    if (newSortBy === currentSortBy) {
      const toggledOrder = currentSortOrder === "asc" ? "desc" : "asc";
      params.set("sortOrder", newSortOrder || toggledOrder);
    } else {
      params.set(
        "sortOrder",
        newSortOrder || (newSortBy === "price" ? "desc" : "asc")
      );
    }

    return `?${params.toString()}`;
  };

  const handleSort = (sortBy: "price" | "alphabetical") => {
    setLoadingButton(sortBy);
    startTransition(() => {
      router.push(generateSortUrl(sortBy));
    });
  };

  return (
    <div className="flex gap-2">
      <Button
        variant={currentSortBy === "price" ? "default" : "outline"}
        size="sm"
        className="text-xs"
        onClick={() => handleSort("price")}
        disabled={isPending}
      >
        {loadingButton === "price" && isPending ? (
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
        ) : (
          <ArrowUpDown className="h-3 w-3 mr-1" />
        )}
        Price{" "}
        {currentSortBy === "price"
          ? currentSortOrder === "desc"
            ? "↓"
            : "↑"
          : ""}
      </Button>
      <Button
        variant={currentSortBy === "alphabetical" ? "default" : "outline"}
        size="sm"
        className="text-xs"
        onClick={() => handleSort("alphabetical")}
        disabled={isPending}
      >
        {loadingButton === "alphabetical" && isPending ? (
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
        ) : (
          <ArrowUpDown className="h-3 w-3 mr-1" />
        )}
        A-Z{" "}
        {currentSortBy === "alphabetical"
          ? currentSortOrder === "asc"
            ? "↑"
            : "↓"
          : ""}
      </Button>
    </div>
  );
}
