"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function BookingStatusFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") || "all";
  const t = useTranslations("Admin.bookingStatus");

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete("status");
    } else {
      params.set("status", value);
    }

    // Reset page when filtering
    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  return (
    <Select value={currentStatus} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={t("filterPlaceholder")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t("all")}</SelectItem>
        <SelectItem value="pending">{t("pending")}</SelectItem>
        <SelectItem value="confirmed">{t("confirmed")}</SelectItem>
        <SelectItem value="completed">{t("completed")}</SelectItem>
        <SelectItem value="cancelled">{t("cancelled")}</SelectItem>
      </SelectContent>
    </Select>
  );
}
