"use client";

import { HeartIcon } from "lucide-react";
import { addFavourite, removeFavourite } from "@/app/[locale]/actions";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
export default function ToggleFavouriteButton({
  tourId,
  isFavourite,
}: {
  tourId: string;
  isFavourite: boolean;
}) {
  const auth = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [optimisticFavourite, setOptimisticFavourite] = useState(isFavourite);

  return (
    <button
      className="z-10 absolute bg-white/70 rounded-bl-md p-1 -top-0.5 -right-0.5 text-gray-800 border-gray-300 border-t border-r rounded-tr-lg"
      disabled={isLoading}
      onClick={async () => {
        setIsLoading(true);
        try {
          const tokenResult = await auth?.currentUser?.getIdTokenResult();
          if (!tokenResult) {
            setIsLoading(false);
            return;
          }

          const newFavouriteState = !optimisticFavourite;
          setOptimisticFavourite(newFavouriteState);

          if (optimisticFavourite) {
            await removeFavourite(tourId, tokenResult.token);
          } else {
            await addFavourite(tourId, tokenResult.token);
          }

          router.refresh();
          toast.success(
            newFavouriteState
              ? "Added to favorites!"
              : "Removed from favorites :("
          );
          setIsLoading(false);
        } catch (error) {
          // Revert optimistic update on error
          setOptimisticFavourite(isFavourite);
          toast.error("Failed to update favorites. Please try again.");
          setIsLoading(false);
          console.error("Error toggling favourite:", error);
        }
      }}
    >
      <HeartIcon
        className={`${optimisticFavourite ? "fill-red-500" : ""} ${
          isLoading ? "animate-pulse" : ""
        }`}
        strokeWidth={optimisticFavourite ? 0.1 : 1.5}
        size={30}
      />
    </button>
  );
}
