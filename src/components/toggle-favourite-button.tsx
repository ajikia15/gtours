"use client";

import { HeartIcon } from "lucide-react";
import { addFavourite, removeFavourite } from "@/app/[locale]/actions";
import { useAuth } from "@/context/auth";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { getFreshToken } from "@/lib/client-auth-utils";

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
          if (!auth?.currentUser) {
            setIsLoading(false);
            router.push("/login");
            toast.info("Please log in to add to favorites");
            return;
          }

          // Get a fresh token with built-in caching
          const token = await getFreshToken();
          if (!token) {
            setIsLoading(false);
            router.push("/login");
            toast.error("Authentication expired. Please log in again.");
            return;
          }

          const newFavouriteState = !optimisticFavourite;
          setOptimisticFavourite(newFavouriteState);

          if (optimisticFavourite) {
            await removeFavourite(tourId, token);
          } else {
            await addFavourite(tourId, token);
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
