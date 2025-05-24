"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import { useRouter } from "@/i18n/navigation";
import GoogleIcon from "@/components/google-icon";
export default function ContinueWithGoogleButton() {
  const auth = useAuth();
  const router = useRouter();
  return (
    <Button
      className="w-full"
      variant="outline"
      onClick={async () => {
        try {
          await auth?.loginWithGoogle();
          router.refresh();
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
