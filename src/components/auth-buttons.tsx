"use client";
import { useAuth } from "@/context/auth";
import { Button } from "./ui/button";
import { Link } from "@/i18n/navigation";
import { UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";
import LocaleSwitcher from "./layout/LocaleSwitcher";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import ShoppingCart from "./shopping-cart";

export default function AuthButtons() {
  const auth = useAuth();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("Auth");

  useEffect(() => {
    setMounted(true);
  }, []);

  const initialSkeleton = (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </div>
  );

  if (!mounted) {
    return initialSkeleton;
  }

  if (!auth || auth.loading) {
    return initialSkeleton;
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-border/60 bg-muted/40 px-1.5 py-1">
      <LocaleSwitcher />

      {auth.currentUser ? (
        <>
          <span className="h-5 w-px bg-border" />
          <div className="flex items-center">
            <ShoppingCart />
          </div>
          <span className="h-5 w-px bg-border" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full w-9 h-9 hover:bg-background"
              >
                <UserIcon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="font-medium">
                {t("welcome")}, {auth.currentUser.displayName}
              </DropdownMenuLabel>
              <Link href="/account">
                <DropdownMenuItem>{t("myAccount")}</DropdownMenuItem>
              </Link>
              {!!auth.customClaims?.admin ? (
                <Link href="/admin">
                  <DropdownMenuItem>{t("adminDashboard")}</DropdownMenuItem>
                </Link>
              ) : (
                <Link href="/account/my-favourites">
                  <DropdownMenuItem>{t("myFavouriteTours")}</DropdownMenuItem>
                </Link>
              )}
              <DropdownMenuItem
                onClick={async () => {
                  await auth.logout();
                }}
              >
                {t("signOut")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <>
          <span className="h-5 w-px bg-border" />
          <div className="flex items-center gap-1.5 pr-1">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="h-8 px-3 hover:bg-background">
                {t("signIn")}
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="h-8 px-3 rounded-full">{t("signUp")}</Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
