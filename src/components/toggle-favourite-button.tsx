"use client";

import { HeartIcon, HeartPlus } from "lucide-react";
import { addFavourite } from "@/app/[locale]/actions";
import { useAuth } from "@/context/auth";
export default function ToggleFavouriteButton({
  tourId,
  isFavourite,
}: {
  tourId: string;
  isFavourite: boolean;
}) {
  const auth = useAuth();
  return (
    <button
      className="z-10 absolute bg-white rounded-bl-md p-1 -top-0.5 -right-0.5 text-gray-100 border-gray-300 border-t border-r rounded-tr-lg"
      onClick={async () => {
        const tokenResult = await auth?.currentUser?.getIdTokenResult();
        if (!tokenResult) {
          return;
        }
        await addFavourite(tourId, tokenResult?.token);
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
