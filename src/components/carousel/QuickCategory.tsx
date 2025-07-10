import Image from "next/image";
import { useTranslations } from "next-intl";
import { ActivityCarousel } from "./ActivityCarousel";
import { activityTypes } from "@/data/activity-constants";
import { Link } from "@/i18n/navigation";

type Props = {
  className?: string;
};

const QuickCategory = ({ className }: Props) => {
  const t = useTranslations("QuickCategory");

  // Use all available activity types
  const activities = activityTypes;

  return (
    <ActivityCarousel className={className}>
      {activities.map((activity) => (
        <Link
          key={activity.id}
          href={`/destinations?activities=${activity.id}`}
          className="flex-none group"
        >
          <div className="flex flex-col bg-white border-r border-gray-100 last:border-r-0 hover:bg-gray-50 transition-all duration-200 cursor-pointer min-w-[110px] max-w-[140px] first:rounded-l-lg last:rounded-r-lg h-[100px]">
            <div className="flex items-center justify-center pt-4 pb-2 flex-shrink-0">
              <div className="relative h-8 w-8 sm:h-9 sm:w-9">
                <Image
                  src={`/${activity.iconFileName}`}
                  alt={activity.name}
                  fill
                  style={{ objectFit: "contain" }}
                  className="group-hover:scale-105 transition-transform duration-200"
                />
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center px-3 pb-4">
              <span className="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight">
                {t(`${activity.id}`)}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </ActivityCarousel>
  );
};

export default QuickCategory;
