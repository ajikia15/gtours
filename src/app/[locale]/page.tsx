import { getTranslations } from "next-intl/server";
import Carousel from "@/components/carousel/Carousel";
import QuickCategory from "@/components/carousel/QuickCategory";
import InteractiveMapSection from "./interactive-svg-map";

export default async function HomePage() {
  // const t = useTranslations("Homepage");
  const t = await getTranslations("Homepage");

  return (
    <div className="space-y-10 mb-10">
      <h1>{t("title")}</h1>
      <Carousel />
      <InteractiveMapSection />
      <QuickCategory />
    </div>
  );
}
