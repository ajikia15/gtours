import { getTranslations } from "next-intl/server";
import Header from "../header";
import ContactSection from "@/components/contact-section";

export default async function ContactPage() {
  const t = await getTranslations("Pages.contact");

  return (
    <div className="py-12 md:px-0 px-6">
      <div className="text-center mb-16">
        <Header title={t("title")} />
      </div>

      <ContactSection />
    </div>
  );
}
