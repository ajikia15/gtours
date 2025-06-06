"use client";

import { useAuth } from "@/context/auth";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import {
  UserCircleIcon,
  ShoppingCartIcon,
  LogOutIcon,
  SettingsIcon,
  HeartIcon,
  ArrowLeftIcon,
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { useTranslations } from "next-intl";
import { useCart } from "@/context/cart";
import LocaleSwitcher from "./LocaleSwitcher";

export default function BottomNavClient() {
  const auth = useAuth();
  const cart = useCart();
  const tAuth = useTranslations("Auth");
  const tNav = useTranslations("Navbar");

  return (
    <>
      {/* Shopping Cart (if authenticated) */}
      {auth?.currentUser && (
        <Link href="/account/cart" className="flex flex-col items-center">
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col h-14 w-14 p-0 rounded-xl hover:bg-accent/80 transition-colors relative"
          >
            <ShoppingCartIcon className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium">{tNav("cart")}</span>
            {cart.totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold text-[10px]">
                {cart.totalItems > 9 ? "9+" : cart.totalItems}
              </span>
            )}
          </Button>
        </Link>
      )}

      {/* Locale Switcher */}
      <LocaleSwitcher variant="mobile" />

      {/* User Profile / Auth */}
      <div className="flex flex-col items-center">
        {auth?.currentUser ? (
          <UserDrawerBottomNav />
        ) : (
          <Link href="/login" className="flex flex-col items-center">
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col h-14 w-14 p-0 rounded-xl hover:bg-accent/80 transition-colors"
            >
              <UserCircleIcon className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium">{tAuth("signIn")}</span>
            </Button>
          </Link>
        )}
      </div>
    </>
  );
}

// User drawer for bottom nav (similar to mobile navbar)
function UserDrawerBottomNav() {
  const auth = useAuth();
  const t = useTranslations("Auth");

  if (!auth?.currentUser) return null;

  const handleAuthAction = (action?: () => Promise<void>) => {
    return async () => {
      if (action) {
        await action();
      }
    };
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col h-14 w-14 p-0 rounded-xl hover:bg-accent/80 transition-colors"
        >
          <UserCircleIcon className="h-6 w-6 mb-1" />
          <span className="text-xs font-medium">Profile</span>
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
            <DrawerTitle>{t("myAccount")}</DrawerTitle>
          </div>
        </DrawerHeader>
        <div className="px-4 pb-8">
          <div className="flex flex-col space-y-4">
            {/* User greeting */}
            <div className="flex items-center space-x-3 p-3 bg-accent/50 rounded-lg">
              <UserCircleIcon className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium text-sm">
                  {t("welcome")}, {auth.currentUser.displayName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {auth.currentUser.email}
                </p>
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col space-y-2">
              <Link href="/account">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  size="lg"
                >
                  <SettingsIcon className="mr-3 h-5 w-5" />
                  {t("myAccount")}
                </Button>
              </Link>

              {auth.customClaims?.admin ? (
                <Link href="/admin">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    size="lg"
                  >
                    <SettingsIcon className="mr-3 h-5 w-5" />
                    {t("adminDashboard")}
                  </Button>
                </Link>
              ) : (
                <Link href="/account/my-favourites">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    size="lg"
                  >
                    <HeartIcon className="mr-3 h-5 w-5" />
                    {t("myFavouriteTours")}
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
                {t("signOut")}
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
