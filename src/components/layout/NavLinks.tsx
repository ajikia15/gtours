import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export default function NavLinks() {
  const t = useTranslations("Navbar");

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
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "transition-colors text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
