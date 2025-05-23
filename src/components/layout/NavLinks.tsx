"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function NavLinks() {
  const t = useTranslations("Navbar");
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/destinations", label: t("destinations") },
    { href: "/blog", label: t("blog") },
    { href: "/about", label: t("aboutUs") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <div className="hidden md:flex space-x-4">
      {navItems.map((item) => {
        // Remove locale prefix for comparison if present
        const cleanPathname =
          pathname.replace(/^\/[a-z]{2}(?:-[A-Z]{2})?/, "") || "/";
        const isActive =
          cleanPathname === item.href ||
          (item.href !== "/" && cleanPathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "transition-colors",
              isActive
                ? "text-primary font-medium" // Active link styles
                : "text-muted-foreground hover:text-foreground" // Inactive link styles
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
