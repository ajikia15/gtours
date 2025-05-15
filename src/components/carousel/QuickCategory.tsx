import Image from "next/image";
import { useTranslations } from "next-intl";
import { ActivityCarousel } from "./ActivityCarousel";

type QuickCategoryProps = {
  className?: string;
};

type ActivityItem = {
  name: string;
};

const QuickCategory = ({ className }: QuickCategoryProps) => {
  const t = useTranslations("QuickCategory");

  // Mock data: HorseRiding 12 times
  const activities: ActivityItem[] = Array(18).fill({ name: "HorseRiding" });

  return (
    <ActivityCarousel className={className}>
      {activities.map((activity, index) => (
        <div
          key={index}
          className="w-36 flex-none px-2 flex flex-col items-center justify-center cursor-pointer"
        >
          <div className="relative h-12 w-12 mb-2">
            <Image
              src={`/${activity.name}.svg`}
              alt={activity.name}
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className="w-full text-center flex items-center justify-center">
            <span className="text-base font-medium leading-tight">
              {t(`${activity.name}`)}
            </span>
          </div>
          {index < activities.length - 1 && (
            <div className="absolute right-0 top-1/2 h-8 w-px bg-gray-200 -translate-y-1/2"></div>
          )}
        </div>
      ))}
    </ActivityCarousel>
  );
};

export default QuickCategory;
