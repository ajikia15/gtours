import { OfferedActivity } from "@/types/Activity";
import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getActivityIcon } from "@/lib/imageHelpers";

export default function TourActivitiesSection({
  activities,
}: {
  activities: OfferedActivity[];
}) {
  const quickCategory = useTranslations("QuickCategory");
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Activities</h2>
      <div className="flex flex-col gap-2">
        <Accordion type="single" collapsible className="w-full">
          {activities.map((activity) => (
            <AccordionItem
              key={activity.activityTypeId}
              value={activity.activityTypeId}
            >
              <AccordionTrigger>
                <div className="flex items-center gap-4 text-lg font-bold">
                  {getActivityIcon(activity.activityTypeId, false, 24)}
                  {quickCategory(activity.activityTypeId)}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {activity.specificDescription}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
