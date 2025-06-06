import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { HomeIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import BottomNavClient from "./BottomNavClient";

export default async function BottomNavbar() {
  const t = await getTranslations("Navbar");

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t shadow-xl">
      <div className="flex items-center justify-around py-3 px-4 safe-area-bottom">
        {/* Home */}
        <Link href="/" className="flex flex-col items-center">
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col h-14 w-14 p-0 rounded-xl hover:bg-accent/80 transition-colors"
          >
            <HomeIcon className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium">{t("home")}</span>
          </Button>
        </Link>

        {/* Client-side interactive components */}
        <BottomNavClient />
      </div>
    </div>
  );
}
