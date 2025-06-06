import { MenuIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Separator } from "../ui/separator";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export default function MobileNavbar() {
  const t = useTranslations("Navbar");

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/destinations", label: t("destinations") },
    { href: "/blog", label: t("blog") },
    { href: "/about", label: t("aboutUs") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <div className="fixed top-0 inset-x-0 flex items-center justify-between bg-white w-full z-50 p-3">
      <Link href="/" className="flex items-center space-x-2">
        <span className="font-bold text-xl text-primary">{t("logo")}</span>
      </Link>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            aria-label="Open navigation menu"
          >
            <MenuIcon className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80 sm:w-96">
          <SheetHeader>
            <SheetTitle className="text-left">{t("menu")}</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col space-y-6 py-6">
            {/* Navigation Links */}
            <div className="space-y-4">
              {navItems.map((item) => {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block text-lg font-medium transition-colors py-3 px-4 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <Separator />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
