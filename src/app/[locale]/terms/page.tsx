import { getLocale } from "next-intl/server";
import LegalPage from "@/components/legal-page";
import { getLegalDocument } from "@/data/legal";

export default async function TermsPage() {
  const locale = await getLocale();
  const doc = getLegalDocument("terms", locale);

  return <LegalPage document={doc} />;
}
