import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import Carousel from "@/components/carousel/Carousel";
import QuickCategory from "@/components/carousel/QuickCategory";
export default async function HomePage() {
  // const t = useTranslations("Homepage");
  const t = await getTranslations("Homepage");

  return (
    <div className="">
      <h1>{t("title")}</h1>
      <Carousel />
      <QuickCategory />
    </div>
  );
}
