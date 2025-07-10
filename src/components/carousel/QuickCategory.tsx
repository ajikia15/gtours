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
          <div className="flex flex-col items-center justify-center px-5 py-4 bg-white border-r border-gray-100 last:border-r-0 hover:bg-gray-50 transition-all duration-200 cursor-pointer min-w-[110px] max-w-[140px] first:rounded-l-lg last:rounded-r-lg">
            <div className="relative h-8 w-8 sm:h-9 sm:w-9 mb-2.5 flex-shrink-0">
              <Image
                src={`/${activity.iconFileName}`}
                alt={activity.name}
                fill
                style={{ objectFit: "contain" }}
                className="group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight truncate w-full px-1">
              {t(`${activity.id}`)}
            </span>
          </div>
        </Link>
      ))}
    </ActivityCarousel>
  );
};

export default QuickCategory;
