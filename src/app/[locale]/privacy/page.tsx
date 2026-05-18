import { getLocale } from "next-intl/server";
import LegalPage from "@/components/legal-page";
import { getLegalDocument } from "@/data/legal";

export default async function PrivacyPage() {
  const locale = await getLocale();
  const doc = getLegalDocument("privacy", locale);

  return <LegalPage document={doc} />;
}
