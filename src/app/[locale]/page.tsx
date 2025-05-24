import Carousel from "@/components/carousel/Carousel";
import QuickCategory from "@/components/carousel/QuickCategory";
import InteractiveMapSection from "./interactive-map-section";
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  // const t = useTranslations("Homepage");
  const t = await getTranslations("Homepage");

  return (
    <div className="space-y-10 mb-10">
      <Carousel />
      <h1 className="text-center my-8 text-2xl font-bold">{t("activities")}</h1>
      <QuickCategory />
      <h1 className="text-center my-8 text-2xl font-bold">
        {t("discover-georgia")}
      </h1>
      <InteractiveMapSection />
    </div>
  );
}
