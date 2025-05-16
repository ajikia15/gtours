"use client";

import { Button } from "@/components/ui/button";
import { auth } from "../../firebase/client";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function ContinueWithGoogleButton() {
  return (
    <Button
      className="w-full"
      onClick={() => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider);
      }}
    >
      Continue with Google
    </Button>
  );
}
