"use client";
import { useAuth } from "@/context/auth";
import { Button } from "./ui/button";
import { Link } from "@/i18n/navigation";
import { UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function AuthButtons() {
  const auth = useAuth();

  return (
    <div>
      {auth?.currentUser ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <UserIcon className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="font-medium">
              Welcome, {auth.currentUser.email?.split("@")[0] || "User"}
            </DropdownMenuItem>
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
