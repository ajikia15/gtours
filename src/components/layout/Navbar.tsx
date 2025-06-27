import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import AuthButtons from "../auth-buttons";
import NavLinks from "./NavLinks";
import Image from "next/image";
export default async function Navbar() {
  const t = await getTranslations("Navbar");
  return (
    <nav className="bg-background fixed top-0 z-50 w-full border-b">
      <div className="container mx-auto">
        <div className="grid grid-cols-3 items-center h-16">
          {/* Left - Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/logo_notxt.svg"
                alt="Georgia Travel Tours"
                width={40}
                height={40}
              />
              <span className="font-bold  text-primary">{t("logo")}</span>
            </Link>
          </div>

          {/* Center - Navigation Links */}
          <div className="flex justify-center">
            <NavLinks />
          </div>

          {/* Right - Auth Buttons */}
          <div className="flex items-center justify-end space-x-4">
            <AuthButtons />
          </div>
        </div>
      </div>
    </nav>
  );
}
