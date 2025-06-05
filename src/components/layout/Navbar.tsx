import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import AuthButtons from "../auth-buttons";
import NavLinks from "./NavLinks";
import MobileNavbar from "./MobileNavbar";

export default async function Navbar() {
  const t = await getTranslations("Navbar");
  return (
    <nav className="bg-background fixed top-0 z-50 w-full md:border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Always visible */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl text-primary">
                {t("logo")}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex">
            <NavLinks />
          </div>

          {/* Desktop Auth Buttons - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-4">
            <AuthButtons />
          </div>

          {/* Mobile Navigation - Hidden on desktop */}
          <MobileNavbar />
        </div>
      </div>
    </nav>
  );
}
