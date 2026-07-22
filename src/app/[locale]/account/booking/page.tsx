import { getTranslations } from "next-intl/server";

export default async function BookingPage() {
  const t = await getTranslations("Booking");
  return (
    <div>
      <h1>{t("heading")}</h1>
    </div>
  );
}
