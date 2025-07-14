"use client";
import { useAuth } from "@/context/auth";
import { ratingSchema } from "@/validation/ratingSchema";
import { PencilIcon } from "lucide-react";
import { z } from "zod";
import { editRating } from "../../actions";
import RatingForm from "@/components/rating-form";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { Rating } from "@/types/Rating";
import { useTranslations } from "next-intl";

type Props = Rating;

export default function EditRatingForm({
  id,
  title,
  review,
  author,
  rating,
  createdDate,
  status,
  tourId,
}: Props) {
  const auth = useAuth();
  const router = useRouter();
  const t = useTranslations("Admin.ratingForm");

  async function handleSubmit(data: z.infer<typeof ratingSchema>) {
    const token = await auth?.currentUser?.getIdToken();
    if (!token) {
      return;
    }

    const response = await editRating(data, id, token);
    if (!!response?.error) {
      toast.error(t("messages.errorSaving"));
      return;
    }

    toast.success(t("messages.savedSuccessfully"));
    router.push("/admin"); // TODO: redirect to the rating details
  }

  return (
    <div>
      <RatingForm
        handleSubmit={handleSubmit}
        submitButtonLabel={
          <>
            <PencilIcon className="size-4" />
            {t("updateRating")}
          </>
        }
        defaultValues={{
          title,
          review,
          author,
          rating,
          createdDate,
          status,
          tourId,
        }}
      />
    </div>
  );
}
