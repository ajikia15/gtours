import { getTranslations } from "next-intl/server";

export default async function TourSuggestions() {
  const t = await getTranslations("TourDetails");
  return (
    <h2 className="text-xl font-semibold text-gray-900">{t("suggestions")}</h2>
  );
}
