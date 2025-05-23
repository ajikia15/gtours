import { getTranslations } from "next-intl/server";

export default async function DestinationsPage() {
  const t = await getTranslations("Pages.destinations");

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
        <p className="text-xl text-muted-foreground mb-6">{t("subtitle")}</p>
        <p className="text-lg leading-relaxed">{t("description")}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Placeholder destination cards - in a real app, these would come from data */}
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="h-48 bg-muted"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Destination {item}</h3>
              <p className="text-muted-foreground mb-4">
                Beautiful destination description that would come from your data
                source.
              </p>
              <button className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors">
                {t("exploreTours")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
