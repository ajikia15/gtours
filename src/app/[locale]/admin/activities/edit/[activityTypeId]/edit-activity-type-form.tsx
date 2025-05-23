"use client";
import { useAuth } from "@/context/auth";
import { activityTypeSchema } from "@/validation/activityTypeSchema";
import { PencilIcon } from "lucide-react";
import { z } from "zod";
import { updateExistingActivityType } from "../../actions"; // Adjusted path for actions
import ActivityTypeForm from "@/components/activity-type-form";
import { toast } from "sonner";
import { useRouter, usePathname } from "@/i18n/navigation";
import { ActivityType } from "@/types/Activity";
import { useTranslations } from "next-intl";
import { useState } from "react";

type Props = {
  activityType: ActivityType;
};

export default function EditActivityTypeForm({ activityType }: Props) {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("AdminEditActivityTypeForm");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Extract locale from pathname, assuming format like /en/admin/activities/edit/activityId
  const locale = pathname.split("/")[1] || "en";

  async function handleSubmit(data: z.infer<typeof activityTypeSchema>) {
    setIsSubmitting(true);
    const token = await auth?.currentUser?.getIdToken();
    if (!token) {
      toast.error(t("error.authenticationFailed"));
      setIsSubmitting(false);
      return;
    }

    const response = await updateExistingActivityType(
      activityType.id,
      data,
      token,
      locale
    );

    if (response.error) {
      toast.error(t("error.updatingActivityType", { error: response.error }));
      setIsSubmitting(false);
      return;
    }

    if (response.success) {
      toast.success(t("success.activityTypeUpdated"));
      router.push(`/${locale}/admin/activities`); // Redirect to activities table
    }
    setIsSubmitting(false);
  }

  return (
    <div>
      <ActivityTypeForm
        handleSubmit={handleSubmit}
        submitButtonLabel={
          <>
            <PencilIcon className="size-4" />
            {t("updateActivityTypeButton")}
          </>
        }
        defaultValues={{
          name: activityType.name,
          genericDescription: activityType.genericDescription,
          icon: activityType.icon,
        }}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
