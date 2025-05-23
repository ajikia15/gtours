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

export default function AuthButtons() {
  const auth = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

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
              Welcome, {auth.currentUser.displayName}
            </DropdownMenuLabel>
            <DropdownMenuItem>My Account</DropdownMenuItem>
            {!!auth.customClaims?.admin && (
              <DropdownMenuItem>
                <Link href="/admin">Admin Dashboard</Link>
              </DropdownMenuItem>
            )}
            {!auth.customClaims?.admin && (
              <DropdownMenuItem>
                <Link href="/admin">My Favorite Tours</Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={async () => {
                await auth.logout();
                router.refresh();
              }}
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <Button className="">
            <Link href="/register">Register</Link>
          </Button>
          <Button variant="brandred">
            <Link href="/login">Sign in</Link>
          </Button>
        </>
      )}
    </div>
  );
}
