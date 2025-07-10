import Image from "next/image";
import { useTranslations } from "next-intl";
import { ActivityCarousel } from "./ActivityCarousel";
import { activityTypes } from "@/data/activity-constants";
import { Link } from "@/i18n/navigation";
import React from "react";

type Props = {
  className?: string;
};

const QuickCategory = ({ className }: Props) => {
  const t = useTranslations("QuickCategory");

  // Use all available activity types
  const activities = activityTypes;

  return (
    <ActivityCarousel className={className}>
      {activities.map((activity, index) => (
        <React.Fragment key={index}>
          {" "}
          <Link
            href={`/destinations?activities=${activity.id}`}
            className="w-36 sm:w-28 md:w-32 lg:w-36 flex-none px-1 sm:px-2 flex flex-col items-center justify-center cursor-pointer py-4 hover:bg-gray-50 transition-colors rounded-lg"
          >
            <div className="relative h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mb-1 sm:mb-2">
              <Image
                src={`/${activity.iconFileName}`}
                alt={activity.name}
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className="w-full text-center flex items-center justify-center">
              <span className="text-xs sm:text-sm md:text-base font-medium leading-tight">
                {t(`${activity.id}`)}
              </span>{" "}
            </div>
          </Link>
          {index < activities.length - 1 && (
            <div
              key={`${index}_separator`}
              className="w-[2px] bg-gray-200 h-10 sm:h-12 md:h-14 lg:h-18 my-auto"
            ></div>
          )}
        </React.Fragment>
      ))}
    </ActivityCarousel>
  );
};

export default QuickCategory;
