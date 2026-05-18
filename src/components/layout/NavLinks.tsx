"use client";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";

export default function NavLinks() {
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/destinations", label: t("destinations") },
    { href: "/blog", label: t("blog") },
    { href: "/about", label: t("aboutUs") },
    { href: "/contact", label: t("contact") },
  ];

  const spacingClass = locale === "ge" ? "space-x-5 lg:space-x-7" : "space-x-7 lg:space-x-9";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className={cn("hidden md:flex", spacingClass)}>
      {navItems.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group relative whitespace-nowrap text-sm lg:text-[15px] font-medium uppercase tracking-[0.08em] transition-colors py-1",
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
            <span
              className={cn(
                "pointer-events-none absolute left-1/2 -bottom-0.5 h-[2px] -translate-x-1/2 bg-brand-secondary transition-all duration-300 ease-out",
                active ? "w-full" : "w-0 group-hover:w-full"
              )}
            />
          </Link>
        );
      })}
    </div>
  );
}
