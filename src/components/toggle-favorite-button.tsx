"use client";

import { HeartPlus } from "lucide-react";
import { addFavorite } from "@/app/[locale]/actions";
import { useAuth } from "@/context/auth";
export default function ToggleFavoriteButton({ tourId }: { tourId: string }) {
  const auth = useAuth();
  return (
    <button
      className="z-10 absolute top-4 right-4"
      onClick={async () => {
        const tokenResult = await auth?.currentUser?.getIdTokenResult();
        if (!tokenResult) {
          return;
        }
        await addFavorite(tourId, tokenResult?.token);
      }}
    >
      <HeartPlus />
    </button>
  );
}
