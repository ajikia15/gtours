"use client";

import { TourStatus } from "@/validation/tourSchema";
import { Badge } from "./ui/badge";
import { useTranslations } from "next-intl";

const variant: {
  [key: string]: "default" | "destructive" | "outline" | "secondary";
} = {
  draft: "outline",
  disabled: "secondary",
  active: "default",
};

export default function TourStatusBadge({ status }: { status: TourStatus }) {
  const t = useTranslations("Admin.status");

  return <Badge variant={variant[status]}>{t(status)}</Badge>;
}
