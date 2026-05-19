"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";

export default function NavLinks() {
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const pathname = usePathname();
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  // Clear optimistic path once the real pathname catches up.
  useEffect(() => {
    setPendingPath(null);
  }, [pathname]);

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/destinations", label: t("destinations") },
    { href: "/blog", label: t("blog") },
    { href: "/about", label: t("aboutUs") },
    { href: "/contact", label: t("contact") },
  ];

  const spacingClass =
    locale === "ge" ? "space-x-5 lg:space-x-7" : "space-x-7 lg:space-x-9";

  const activePath = pendingPath ?? pathname;
  const isActive = (href: string) =>
    href === "/" ? activePath === "/" : activePath.startsWith(href);

  return (
    <div className={cn("hidden md:flex", spacingClass)}>
      {navItems.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => {
              if (item.href !== pathname) setPendingPath(item.href);
            }}
            className={cn(
              "group relative whitespace-nowrap text-sm lg:text-[15px] font-medium uppercase tracking-[0.08em] py-1 transition-colors",
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
            <span
              className={cn(
                "pointer-events-none absolute left-1/2 -bottom-0.5 h-[2px] -translate-x-1/2 bg-brand-secondary transition-all duration-200 ease-out",
                active ? "w-full" : "w-0 group-hover:w-full"
              )}
            />
          </Link>
        );
      })}
    </div>
  );
}
