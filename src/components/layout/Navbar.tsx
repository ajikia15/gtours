import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import AuthButtons from "../auth-buttons";
import NavLinks from "./NavLinks";

export default async function Navbar() {
  const t = await getTranslations("Navbar");

  return (
    <nav className="bg-background fixed top-0 z-50 w-full">
      <div className="container mx-auto ">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl text-primary">
                {t("logo")}
              </span>
            </Link>
          </div>

          <NavLinks />

          <div className="flex items-center space-x-4">
            {/* <LocaleSwitcher /> LocaleSwitcher is now rendered inside AuthButtons */}
            <AuthButtons />
          </div>
        </div>
      </div>
    </nav>
  );
}
