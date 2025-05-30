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
          await auth?.loginWithGoogle();
          // Redirect will be handled by parent component's auth state listener
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
