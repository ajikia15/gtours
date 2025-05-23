import { getTranslations } from "next-intl/server";

export default async function ContactPage() {
  const t = await getTranslations("Pages.contact");

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
        <p className="text-xl text-muted-foreground mb-6">{t("subtitle")}</p>
        <p className="text-lg leading-relaxed">{t("description")}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">{t("phoneNumber")}</h3>
            <p className="text-muted-foreground">+995 555 123 456</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">{t("emailAddress")}</h3>
            <p className="text-muted-foreground">info@gtours.ge</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">
              {t("officeLocation")}
            </h3>
            <p className="text-muted-foreground">Tbilisi, Georgia</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">{t("businessHours")}</h3>
            <div className="text-muted-foreground space-y-1">
              <p>{t("weekdays")}</p>
              <p>{t("weekends")}</p>
            </div>
          </div>
        </div>

        <div className="bg-muted/30 p-8 rounded-lg">
          <h3 className="text-xl font-semibold mb-6">{t("sendMessage")}</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("name")}
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder={t("yourName")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("email")}
              </label>
              <input
                type="email"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder={t("yourEmail")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("message")}
              </label>
              <textarea
                rows={5}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder={t("yourMessage")}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-md hover:bg-primary/90 transition-colors"
            >
              {t("sendButton")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
