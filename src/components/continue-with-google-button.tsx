"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import { useRouter } from "@/i18n/navigation";
export default function ContinueWithGoogleButton() {
  const auth = useAuth();
  const router = useRouter();
  return (
    <Button
      className="w-full"
      onClick={async () => {
        await auth?.loginWithGoogle();
        router.refresh();
      }}
    >
      Continue with Google
    </Button>
  );
}
