"use client";

import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";

interface SortableHeaderProps {
  title: string;
  value: string;
}

export function SortableHeader({ title, value }: SortableHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort");
  const currentOrder = searchParams.get("order");

  const isSorted = currentSort === value;
  const isAsc = currentOrder === "asc";

  const toggleSort = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (isSorted) {
      params.set("order", isAsc ? "desc" : "asc");
    } else {
      params.set("sort", value);
      params.set("order", "desc"); // Default to desc for new sort
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <Button
      variant="ghost"
      onClick={toggleSort}
      className="-ml-4 h-8 data-[state=open]:bg-accent"
    >
      <span>{title}</span>
      {isSorted ? (
        isAsc ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : (
          <ArrowDown className="ml-2 h-4 w-4" />
        )
      ) : (
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      )}
    </Button>
  );
}
