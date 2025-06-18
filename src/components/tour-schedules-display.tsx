"use client";

import { ScheduleItem } from "@/types/Tour";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Calendar } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useTranslations } from "next-intl";

interface TourSchedulesDisplayProps {
  schedules: ScheduleItem[];
  locale: string;
}

export default function TourSchedulesDisplay({
  schedules,
  locale,
}: TourSchedulesDisplayProps) {
  const t = useTranslations("TourDetails");

  if (!schedules || schedules.length === 0) {
    return null;
  }

  const getLocaleIndex = (locale: string) => {
    switch (locale) {
      case "en":
        return 0;
      case "ge":
        return 1;
      case "ru":
        return 2;
      default:
        return 0;
    }
  };

  const localeIndex = getLocaleIndex(locale);

  return (
    <div className="space-y-4">
      {" "}
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold text-gray-900">
          {t("tourSchedule", { fallback: "Schedule" })}
        </h2>
      </div>
      <Accordion type="single" collapsible className="w-full space-y-2">
        {schedules.map((schedule, index) => {
          const title =
            schedule.title[localeIndex] ||
            schedule.title[0] ||
            `Schedule ${index + 1}`;
          const description =
            schedule.description[localeIndex] || schedule.description[0] || "";

          return (
            <AccordionItem
              key={schedule.id}
              value={schedule.id}
              className="border border-gray-200 rounded-lg px-4 shadow-sm"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3 text-left">
                  <div>
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="pr-4">
                  {description && (
                    <div className="prose prose-sm max-w-none text-gray-700">
                      <ReactMarkdown>{description}</ReactMarkdown>
                    </div>
                  )}
                  {!description && (
                    <p className="text-gray-500 italic">
                      {t("noDescription", {
                        fallback: "No description available",
                      })}
                    </p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
