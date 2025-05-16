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

export default function AuthButtons() {
  const auth = useAuth();
  return (
    <div>
      {auth?.currentUser ? (
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
            <DropdownMenuItem onClick={() => auth.logout()}>
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
