"use client";
import { Locale, useLocale } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { GlobeIcon, ArrowLeftIcon } from "lucide-react";
import { useState, useEffect } from "react";

interface LocaleSwitcherProps {
  variant?: "desktop" | "mobile";
}

export default function LocaleSwitcher({ variant }: LocaleSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [languageDrawerOpen, setLanguageDrawerOpen] = useState(false);
  useEffect(() => {
    // Check if we're on mobile based on user agent
    const userAgent = navigator.userAgent || "";
    const mobile = /android.+mobile|ip(hone|[oa]d)/i.test(userAgent);
    setIsMobile(mobile);
  }, []);

  const getLanguageName = (locale: string) => {
    switch (locale) {
      case "en":
        return "English";
      case "ge":
        return "ქართული";
      case "ru":
        return "Русский";
      default:
        return locale.toUpperCase();
    }
  };

  function handleLocaleChange(nextLocale: string) {
    router.replace({ pathname }, { locale: nextLocale as Locale });
    if (variant === "mobile" || isMobile) {
      setLanguageDrawerOpen(false);
    }
  }

  // Force mobile variant for bottom nav or auto-detect
  const shouldUseMobile =
    variant === "mobile" || (variant === undefined && isMobile);

  if (shouldUseMobile) {
    return (
      <Drawer open={languageDrawerOpen} onOpenChange={setLanguageDrawerOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col h-14 w-14 p-0 rounded-xl hover:bg-accent/80 transition-colors"
          >
            <GlobeIcon className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium">Language</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <div className="flex items-center gap-2">
              <DrawerClose asChild>
                <Button variant="ghost" size="icon">
                  <ArrowLeftIcon className="h-4 w-4" />
                </Button>
              </DrawerClose>
              <DrawerTitle>Language / ენა / Язык</DrawerTitle>
            </div>
          </DrawerHeader>
          <div className="px-4 pb-8">
            <div className="flex flex-col space-y-2">
              {routing.locales.map((loc: string) => {
                const isActive = locale === loc;
                return (
                  <Button
                    key={loc}
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full justify-start text-left"
                    onClick={() => handleLocaleChange(loc)}
                    size="lg"
                  >
                    <span className="mr-3 text-lg">{loc.toUpperCase()}</span>
                    <span className="text-sm text-muted-foreground">
                      {getLanguageName(loc)}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
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
