"use client";

import { HeartPlus } from "lucide-react";
import { addFavourite } from "@/app/[locale]/actions";
import { useAuth } from "@/context/auth";
export default function ToggleFavouriteButton({ tourId }: { tourId: string }) {
  const auth = useAuth();
  return (
    <button
      className="z-10 absolute top-4 right-4 bg-black text-white"
      onClick={async () => {
        const tokenResult = await auth?.currentUser?.getIdTokenResult();
        if (!tokenResult) {
          return;
        }
        await addFavourite(tourId, tokenResult?.token);
      }}
    >
      <HeartPlus />
    </button>
  );
}
