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
import { useRouter, usePathname } from "@/i18n/navigation";
import { Skeleton } from "./ui/skeleton";
import LocaleSwitcher from "./layout/LocaleSwitcher";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import ShoppingCart from "./shopping-cart";

export default function AuthButtons() {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [wasAuthenticated, setWasAuthenticated] = useState<boolean | null>(
    null
  );
  const t = useTranslations("Auth");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Monitor authentication state changes for logout redirect
  useEffect(() => {
    if (auth && !auth.loading) {
      const isCurrentlyAuthenticated = !!auth.currentUser;

      // If user was authenticated but now isn't (logout)
      if (wasAuthenticated === true && !isCurrentlyAuthenticated) {
        // Check if user is on a protected page and redirect to home
        const protectedPaths = ["/account", "/admin", "/profile", "/checkout"];
        const isOnProtectedPage = protectedPaths.some((path) =>
          pathname.startsWith(path)
        );

        if (isOnProtectedPage) {
          router.replace("/");
        }
        router.refresh(); // Ensure server state is synced
      }

      setWasAuthenticated(isCurrentlyAuthenticated);
    }
  }, [auth?.currentUser, auth?.loading, router, pathname, wasAuthenticated]);

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
    <div className="flex items-center space-x-4">
      <LocaleSwitcher />

      {auth.currentUser ? (
        <>
          <ShoppingCart />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10"
              >
                <UserIcon className="h-10 w-10" size={10} />
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
                  // Redirect and refresh will be handled automatically by useEffect
                }}
              >
                {t("signOut")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="outline">{t("signIn")}</Button>
          </Link>
          <Link href="/register">
            <Button>{t("signUp")}</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
