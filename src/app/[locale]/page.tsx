import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import Carousel from "@/components/carousel/Carousel";
import QuickCategory from "@/components/carousel/QuickCategory";
import InteractiveMapSection from "./interactive-svg-map";
import { getTours } from "@/data/tours";

export default async function HomePage() {
  // const t = useTranslations("Homepage");
  const t = await getTranslations("Homepage");

  const { data } = await getTours({
    pagination: { page: 1, pageSize: 10 },
  });

  const serializedTours = JSON.parse(JSON.stringify(data));
  return (
    <div className="space-y-10 mb-10">
      <h1>{t("title")}</h1>
      <Carousel />
      <InteractiveMapSection tours={serializedTours} />
      <QuickCategory />
    </div>
  );
}
