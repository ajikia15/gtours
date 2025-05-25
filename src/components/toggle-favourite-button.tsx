"use client";

import { HeartIcon, HeartPlus } from "lucide-react";
import { addFavourite, removeFavourite } from "@/app/[locale]/actions";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
export default function ToggleFavouriteButton({
  tourId,
  isFavourite,
}: {
  tourId: string;
  isFavourite: boolean;
}) {
  const auth = useAuth();
  const router = useRouter();
  return (
    <button
      className="z-10 absolute bg-white/70 rounded-bl-md p-1 -top-0.5 -right-0.5 text-gray-800 border-gray-300 border-t border-r rounded-tr-lg"
      onClick={async () => {
        const tokenResult = await auth?.currentUser?.getIdTokenResult();
        if (!tokenResult) {
          return;
        }
        if (isFavourite) {
          await removeFavourite(tourId, tokenResult.token);
        } else {
          await addFavourite(tourId, tokenResult.token);
        }
        router.refresh();
      }}
    >
      <HeartIcon
        className={`${isFavourite ? "fill-red-500" : ""}`}
        strokeWidth={isFavourite ? 0.1 : 1.5}
        size={30}
      />
    </button>
  );
}
