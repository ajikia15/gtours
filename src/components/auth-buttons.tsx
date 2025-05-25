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
import { useRouter } from "@/i18n/navigation";
import { Skeleton } from "./ui/skeleton";
import LocaleSwitcher from "./layout/LocaleSwitcher";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function AuthButtons() {
  const auth = useAuth();
  const router = useRouter();
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
    <div className="flex items-center space-x-4">
      <LocaleSwitcher />
      {auth.currentUser ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10"
            >
              <UserIcon className="h-10 w-10" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="font-medium">
              {t("welcome")}, {auth.currentUser.displayName}
            </DropdownMenuLabel>
            <DropdownMenuItem>{t("myAccount")}</DropdownMenuItem>
            {!!auth.customClaims?.admin && (
              <Link href="/admin">
                <DropdownMenuItem>{t("adminDashboard")}</DropdownMenuItem>
              </Link>
            )}
            {!auth.customClaims?.admin && (
              <Link href="/account/my-favourites">
                <DropdownMenuItem>{t("myFavouriteTours")}</DropdownMenuItem>
              </Link>
            )}
            <DropdownMenuItem
              onClick={async () => {
                await auth.logout();
                router.refresh();
              }}
            >
              {t("signOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <Link href="/register">
            <Button className="">{t("register")}</Button>
          </Link>

          <Link href="/login">
            <Button variant="brandred">{t("signIn")}</Button>
          </Link>
        </>
      )}
    </div>
  );
}
