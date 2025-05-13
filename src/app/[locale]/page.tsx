import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import Carousel from "./Carousel";

export default async function HomePage() {
  // const t = useTranslations("Homepage");
  const t = await getTranslations("Homepage");

  return (
    <div>
      <h1>{t("title")}</h1>
      <Carousel />
    </div>
  );
}
