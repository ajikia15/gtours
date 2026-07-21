import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import AuthButtons from "../auth-buttons";
import NavLinks from "./NavLinks";
import UtilityBar from "./UtilityBar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import NavShell from "./NavShell";

export default async function Navbar() {
  const t = await getTranslations("Navbar");
  return (
    <NavShell>
      <UtilityBar />
      <div className="container mx-auto">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-16 gap-4">
          {/* Left - Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/logo_notxt.svg"
                alt="Georgia Travel Tours"
                width={40}
                height={40}
              />
              <span className="font-display font-extrabold tracking-tight text-primary">
                {t("logo")}
              </span>
            </Link>
          </div>

          {/* Center - Navigation Links */}
          <div className="flex justify-center min-w-0">
            <NavLinks />
          </div>

          {/* Right - Account cluster + CTA */}
          <div className="flex items-center justify-end gap-3">
            <AuthButtons />
            <Link href="/destinations" className="hidden lg:inline-flex">
              <Button
                variant="brandred"
                size="sm"
                className="rounded-full h-10 px-5 font-semibold shadow-md hover:shadow-lg transition-shadow"
              >
                <span className="[text-box:trim-both_cap_alphabetic]">
                  {t("planTrip")}
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </NavShell>
  );
}
