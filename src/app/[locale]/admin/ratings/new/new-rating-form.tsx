"use client";
import { useAuth } from "@/context/auth";
import { ratingSchema } from "@/validation/ratingSchema";
import { CirclePlusIcon } from "lucide-react";
import { z } from "zod";
import { saveNewRating } from "../actions";
import RatingForm from "@/components/rating-form";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function NewRatingForm() {
  const auth = useAuth();
  const router = useRouter();
  const t = useTranslations("Admin.ratingForm");

  async function handleSubmit(data: z.infer<typeof ratingSchema>) {
    const token = await auth?.currentUser?.getIdToken();

    if (!token) {
      return;
    }
    
    const response = await saveNewRating(data, token);
    if (!!response.error || !response.ratingId) {
      toast.error(t("messages.errorSaving"));
      return;
    }

    if (response?.success) {
      toast.success(t("messages.savedSuccessfully"));
      router.push("/admin"); // TODO: redirect to the new rating
    }
  }

  return (
    <div>
      <RatingForm
        handleSubmit={handleSubmit}
        submitButtonLabel={
          <>
            <CirclePlusIcon className="size-4" />
            {t("createRating")}
          </>
        }
      />
    </div>
  );
}
