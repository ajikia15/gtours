"use client";
import { useAuth } from "@/context/auth";
import { Button } from "./ui/button";
import { Link } from "@/i18n/navigation";

export default function AuthButtons() {
  const auth = useAuth();

  return (
    <div>
      {auth?.currentUser ? (
        <>
          <div>{auth.currentUser.email}</div>
          <div onClick={() => auth.logout()}>Logout</div>
        </>
      ) : (
        <>
          <Button>
            <Link href="/register">Register</Link>
          </Button>
          <Button>
            <Link href="/login">Sign in</Link>
          </Button>
        </>
      )}
    </div>
  );
}
