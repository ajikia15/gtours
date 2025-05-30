"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import GoogleIcon from "@/components/google-icon";

export default function ContinueWithGoogleButton() {
  const auth = useAuth();

  return (
    <Button
      className="w-full"
      variant="outline"
      onClick={async () => {
        try {
          // This now includes token sync
          await auth?.loginWithGoogle();

          // Use window.location.href for a full page redirect to ensure middleware runs
          window.location.href = "/";
        } catch (e) {
          console.error(e);
        }
      }}
    >
      <GoogleIcon />
      Continue with Google
    </Button>
  );
}
