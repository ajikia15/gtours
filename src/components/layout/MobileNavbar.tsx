"use client";

import { ChartNoAxesColumnIncreasing } from "lucide-react";
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

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/destinations", label: t("destinations") },
    { href: "/blog", label: t("blog") },
    { href: "/about", label: t("aboutUs") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <div className="fixed top-0 inset-x-0 flex justify-between items-center bg-white w-full z-50 p-3 pl-5">
      <Link href="/" className="flex items-center justify-center">
        <Image
          src="/logo_notxt.svg"
          alt="Georgia Travel Tours"
          width={40}
          height={40}
        />
        <span className="font-bold  text-primary ml-3">
          Georgia Travel Tours
        </span>
      </Link>

      {/* Right - Menu */}
      <div className="flex justify-end">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="h-12 w-12 p-0"
              aria-label="Open navigation menu"
            >
              <ChartNoAxesColumnIncreasing size={32} className="-rotate-90" />
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
    </div>
  );
}
