import Image from "next/image";
import { useTranslations } from "next-intl";
import { ActivityCarousel } from "./ActivityCarousel";

type QuickCategoryProps = {
  className?: string;
};

type ActivityItem = {
  id: string;
  name: string;
};

const QuickCategory = ({ className }: QuickCategoryProps) => {
  const t = useTranslations("QuickCategory");

  // Mock data: camping 18 times (using kebab-case id now)
  const activities: ActivityItem[] = Array(18).fill({
    id: "camping",
    name: "camping",
  });

  return (
    <ActivityCarousel className={className}>
      {activities.map((activity, index) => (
        <div
          key={index}
          className="w-36 sm:w-28 md:w-32 lg:w-36 flex-none px-1 sm:px-2 flex flex-col items-center justify-center cursor-pointer py-4"
        >
          <div className="relative h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mb-1 sm:mb-2">
            <Image
              src={`/${activity.name}.png`}
              alt={activity.name}
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className="w-full text-center flex items-center justify-center">
            <span className="text-xs sm:text-sm md:text-base font-medium leading-tight">
              {t(`${activity.id}`)}
            </span>
          </div>
        </div>
      ))}
    </ActivityCarousel>
  );
};

export default QuickCategory;
