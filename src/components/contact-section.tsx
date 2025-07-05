import { getTranslations } from "next-intl/server";
import { Mail, MapPin, Phone } from "lucide-react";

export default async function ContactSection() {
  const t = await getTranslations("Pages.contact");

  return (
    <div className="flex flex-row gap-12">
      <div className="space-y-8">
        <div>
          <h2 className="font-bold text-xl">{t("title")}</h2>
        </div>
        <div>
          <p className="text-gray-500">{t("contactDescription")}</p>
        </div>
        <div className="flex flex-row gap-3 items-center">
          <div className=" rounded-md bg-gray-200  grid place-items-center w-12 h-12">
            <Phone />
          </div>
          <div>
            <h3 className="text-sm">{t("phoneNumber")}</h3>
            <p className="font-bold">+995 555 123 456</p>
          </div>
        </div>

        <div className="flex flex-row gap-3 items-center">
          <div className=" rounded-md bg-gray-200  grid place-items-center w-12 h-12">
            <Mail />
          </div>
          <div>
            <h3 className=" font-light text-sm">{t("emailAddress")}</h3>
            <p className="font-bold">info@gtours.ge</p>
          </div>
        </div>

        <div className="flex flex-row gap-3 items-center">
          <div className="rounded-md bg-gray-200  grid place-items-center w-12 h-12">
            <MapPin />
          </div>
          <div>
            <h3 className=" font-light text-sm">{t("officeLocation")}</h3>
            <p className="font-bold">Tbilisi, Georgia</p>
          </div>
        </div>
      </div>

      <div className="w-full">
        <h3 className="text-xl font-bold  mb-4">{t("sendMessage")}</h3>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium">{t("name")}</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder={t("yourName")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">{t("email")}</label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder={t("yourEmail")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">{t("message")}</label>
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
  );
}
