"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Separator } from "../ui/separator";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
export default function MobileNavbar() {
  const t = useTranslations("Navbar");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/destinations", label: t("destinations") },
    { href: "/blog", label: t("blog") },
    { href: "/about", label: t("aboutUs") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <div
      className={cn(
        "fixed top-0 inset-x-0 grid grid-cols-[1fr_auto_1fr] items-center w-full z-50 px-3 py-2 transition-colors duration-300",
        scrolled ? "bg-white shadow-sm" : "bg-transparent"
      )}
    >
      <div className="flex justify-start">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "h-10 w-10 p-0 hover:bg-transparent",
                scrolled ? "text-primary" : "text-white"
              )}
              aria-label="Open navigation menu"
            >
              <Menu size={26} strokeWidth={1.5} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 sm:w-96">
            <SheetHeader>
              <SheetTitle className="text-left">{t("menu")}</SheetTitle>
            </SheetHeader>

            <div className="flex flex-col space-y-6 py-6">
              {/* Navigation Links */}
              <div className="space-y-4">
                {navItems.map((item) => {
                  return (
                    <SheetClose key={item.href} asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "block text-lg font-medium transition-colors py-3 px-4 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
                        )}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  );
                })}
              </div>
              <Separator />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Link href="/" className="flex items-center justify-center gap-2">
        <Image
          src="/logo_notxt.svg"
          alt="Georgia Travel Tours"
          width={22}
          height={22}
        />
        <span
          className={cn(
            "font-display font-extrabold tracking-tight text-sm whitespace-nowrap transition-colors",
            scrolled ? "text-primary" : "text-white"
          )}
        >
          {t("logo")}
        </span>
      </Link>

      <div className="flex justify-end">
        <Link href="/destinations">
          <Button
            variant="brandred"
            size="sm"
            className="rounded-full h-8 px-4 font-medium text-sm"
          >
            {t("planShort")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
