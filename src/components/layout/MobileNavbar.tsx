"use client";

import { useState, useEffect } from "react";
import {
  MenuIcon,
  GlobeIcon,
  LogOutIcon,
  UserCircleIcon,
  HeartIcon,
  SettingsIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "../ui/drawer";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { useLocale, Locale } from "next-intl";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth";
import ShoppingCart from "../shopping-cart";

export default function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [languageDrawerOpen, setLanguageDrawerOpen] = useState(false);
  const [userDrawerOpen, setUserDrawerOpen] = useState(false);
  const t = useTranslations("Navbar");
  const tAuth = useTranslations("Auth");
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const auth = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };
  const handleLocaleChange = (nextLocale: string) => {
    router.replace({ pathname }, { locale: nextLocale as Locale });
    setLanguageDrawerOpen(false);
    handleClose();
  };
  const handleAuthAction = (action?: () => Promise<void>) => {
    return async () => {
      if (action) {
        await action();
      }
      setUserDrawerOpen(false);
      handleClose();
    };
  };

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/destinations", label: t("destinations") },
    { href: "/blog", label: t("blog") },
    { href: "/about", label: t("aboutUs") },
    { href: "/contact", label: t("contact") },
  ];

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

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        {" "}
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            aria-label="Open navigation menu"
          >
            <MenuIcon className="h-6 w-6" />
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
                const cleanPathname =
                  pathname.replace(/^\/[a-z]{2}(?:-[A-Z]{2})?/, "") || "/";
                const isActive =
                  cleanPathname === item.href ||
                  (item.href !== "/" && cleanPathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleClose}
                    className={cn(
                      "block text-lg font-medium transition-colors py-3 px-4 rounded-md",
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>{" "}
            <Separator />
            {/* Language Switcher with Drawer */}
            <div>
              <Drawer
                open={languageDrawerOpen}
                onOpenChange={setLanguageDrawerOpen}
              >
                <DrawerTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between"
                    size="lg"
                  >
                    <div className="flex items-center space-x-2">
                      <GlobeIcon className="h-4 w-4" />
                      <span>{getLanguageName(locale)}</span>
                    </div>
                    <ChevronRightIcon className="h-4 w-4" />
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
                            <span className="mr-3 text-lg">
                              {loc.toUpperCase()}
                            </span>
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
            </div>
            <Separator /> {/* Auth Section */}
            {!mounted || !auth || auth.loading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : auth.currentUser ? (
              <div>
                <Drawer open={userDrawerOpen} onOpenChange={setUserDrawerOpen}>
                  <DrawerTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-4"
                      size="lg"
                    >
                      <div className="flex items-center space-x-3">
                        <UserCircleIcon className="h-8 w-8 text-primary" />
                        <div className="text-left">
                          <p className="font-medium text-sm">
                            {auth.currentUser.displayName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {tAuth("myAccount")}
                          </p>
                        </div>
                      </div>
                      <ChevronRightIcon className="h-4 w-4" />
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
                        <DrawerTitle>{tAuth("myAccount")}</DrawerTitle>
                      </div>
                    </DrawerHeader>
                    <div className="px-4 pb-8">
                      <div className="flex flex-col space-y-4">
                        {/* User greeting */}
                        <div className="flex items-center space-x-3 p-3 bg-accent/50 rounded-lg">
                          <UserCircleIcon className="h-8 w-8 text-primary" />
                          <div>
                            <p className="font-medium text-sm">
                              {tAuth("welcome")}, {auth.currentUser.displayName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {auth.currentUser.email}
                            </p>
                          </div>
                        </div>

                        {/* Shopping Cart */}
                        <ShoppingCart />

                        <Separator />

                        {/* Menu Items */}
                        <div className="flex flex-col space-y-2">
                          <Link
                            href="/account"
                            onClick={() => {
                              setUserDrawerOpen(false);
                              handleClose();
                            }}
                          >
                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                              size="lg"
                            >
                              <SettingsIcon className="mr-3 h-5 w-5" />
                              {tAuth("myAccount")}
                            </Button>
                          </Link>

                          {auth.customClaims?.admin ? (
                            <Link
                              href="/admin"
                              onClick={() => {
                                setUserDrawerOpen(false);
                                handleClose();
                              }}
                            >
                              <Button
                                variant="ghost"
                                className="w-full justify-start"
                                size="lg"
                              >
                                <SettingsIcon className="mr-3 h-5 w-5" />
                                {tAuth("adminDashboard")}
                              </Button>
                            </Link>
                          ) : (
                            <Link
                              href="/account/my-favourites"
                              onClick={() => {
                                setUserDrawerOpen(false);
                                handleClose();
                              }}
                            >
                              <Button
                                variant="ghost"
                                className="w-full justify-start"
                                size="lg"
                              >
                                <HeartIcon className="mr-3 h-5 w-5" />
                                {tAuth("myFavouriteTours")}
                              </Button>
                            </Link>
                          )}

                          <Button
                            variant="ghost"
                            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                            size="lg"
                            onClick={handleAuthAction(auth.logout)}
                          >
                            <LogOutIcon className="mr-3 h-5 w-5" />
                            {tAuth("signOut")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>
            ) : (
              <div className="space-y-3">
                <Link href="/login" onClick={handleClose}>
                  <Button variant="outline" className="w-full" size="lg">
                    {tAuth("signIn")}
                  </Button>
                </Link>
                <Link href="/register" onClick={handleClose}>
                  <Button className="w-full" size="lg">
                    {tAuth("signUp")}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
