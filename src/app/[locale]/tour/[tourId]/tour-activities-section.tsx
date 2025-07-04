import { OfferedActivity } from "@/types/Activity";
import { useTranslations, useLocale } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getActivityIcon } from "@/lib/imageHelpers";
import { getLocalizedActivityDescription } from "@/lib/localizationHelpers";

export default function TourActivitiesSection({
  activities,
}: {
  activities: OfferedActivity[];
}) {
  const quickCategory = useTranslations("QuickCategory");
  const locale = useLocale();
  return (
    <div className="flex flex-col gap-4 px-6 pb-6 pt-3 bg-white rounded-xl shadow-sm min-w-84 border border-gray-100 w-full mt-4">
      <h2 className="text-xl font-bold text-center">Activities</h2>
      <div className="flex flex-col gap-2">
        <Accordion type="single" collapsible className="w-full">
          {activities.map((activity) => (
            <AccordionItem
              key={activity.activityTypeId}
              value={activity.activityTypeId}
            >
              <AccordionTrigger>
                <div className="flex items-center gap-4 font-medium">
                  {getActivityIcon(activity.activityTypeId, false, 24)}
                  {quickCategory(activity.activityTypeId)}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {getLocalizedActivityDescription(activity, locale)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
