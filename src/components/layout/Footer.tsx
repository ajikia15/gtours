import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="bg-slate-900 text-white py-12 rounded-lg my-4 px-6">
      <div className="flex flex-col md:flex-row justify-between gap-10">
        {/* Left side - Logo and testimonial */}
        <div className="md:w-1/4">
          <h2 className="text-3xl font-bold mb-3">{t("logo")}</h2>
          <p className="text-gray-300 text-sm">{t("description")}</p>
        </div>

        {/* Right side - Three columns of links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-6 lg:gap-12 xl:gap-18 ">
          {/* Column 1 */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t("contact")}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">
                  {t("phoneNumber")}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">
                  {t("emailAddress")}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">
                  {t("customerSupport")}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">
                  {t("privacyPolicy")}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t("socialMedia")}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">
                  {t("facebook")}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">
                  {t("instagram")}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">
                  {t("twitter")}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">
                  {t("youtube")}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t("partners")}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">
                  {t("localPartners")}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">
                  {t("tourOperators")}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">
                  {t("hotelPartners")}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">
                  {t("transportPartners")}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
