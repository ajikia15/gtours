"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
export default function ContinueWithGoogleButton() {
  const auth = useAuth();
  return (
    <Button
      className="w-full"
      onClick={() => {
        auth?.loginWithGoogle();
      }}
    >
      Continue with Google
    </Button>
  );
}
