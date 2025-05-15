import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import LocaleSwitcher from "@/components/layout/LocaleSwitcher";

export default async function Navbar() {
  const t = await getTranslations("Navbar");

  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl text-primary">LOGO</span>
            </Link>
          </div>
          <div className="hidden md:flex space-x-4">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("home")}
            </Link>
            <Link
              href="/destinations"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("destinations")}
            </Link>
            <Link
              href="/blog"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("blog")}
            </Link>
            <Link
              href="/about"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("aboutUs")}
            </Link>
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("contact")}
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <LocaleSwitcher />
            <p>user</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
