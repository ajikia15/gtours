import { getTranslations } from "next-intl/server";
import Header from "../header";

export default async function AboutPage() {
  const t = await getTranslations("Pages.about");

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="text-center mb-16">
        <Header title={t("title")} />
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-semibold mb-4">{t("ourMission")}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("missionText")}
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">{t("ourValues")}</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="font-medium">{t("authenticity")}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="font-medium">{t("sustainability")}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="font-medium">{t("excellence")}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="font-medium">{t("safety")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
