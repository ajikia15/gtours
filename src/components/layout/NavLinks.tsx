import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";

export default function NavLinks() {
  const t = useTranslations("Navbar");
  const locale = useLocale();

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/destinations", label: t("destinations") },
    { href: "/blog", label: t("blog") },
    { href: "/about", label: t("aboutUs") },
    { href: "/contact", label: t("contact") },
  ];

  // Adjust spacing based on locale - Georgian needs tighter spacing
  const spacingClass = locale === 'ge' ? 'space-x-2 lg:space-x-3' : 'space-x-4';

  return (
    <div className={cn("hidden md:flex", spacingClass)}>
      {navItems.map((item) => {
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "transition-colors text-muted-foreground hover:text-foreground whitespace-nowrap text-sm lg:text-base"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
