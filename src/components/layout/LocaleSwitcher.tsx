"use client";
import { Locale, useLocale } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useParams } from "next/navigation";

export default function LocaleSwitcher() {
  const locale = useLocale();

  const router = useRouter();

  const pathname = usePathname();
  const params = useParams();
  function handleLocaleChange(nextLocale: string) {
    router.replace({ pathname }, { locale: nextLocale as Locale });
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="px-3 py-2 border rounded">
          {locale.toUpperCase()}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {routing.locales.map((loc: string) => (
          <DropdownMenuItem key={loc} onClick={() => handleLocaleChange(loc)}>
            {loc.toUpperCase()}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
