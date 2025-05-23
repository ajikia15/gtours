"use client";
import { useAuth } from "@/context/auth";
import { activityTypeSchema } from "@/validation/activityTypeSchema";
import { CirclePlusIcon } from "lucide-react";
import { z } from "zod";
import { saveNewActivityType } from "../actions"; // Changed action
import ActivityTypeForm from "@/components/activity-type-form"; // Changed form component
import { toast } from "sonner";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function NewActivityTypeForm() {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("AdminNewActivityTypeForm");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Extract locale from pathname, assuming format like /en/admin/activities/new
  const locale = pathname.split("/")[1] || "en";

  async function handleSubmit(data: z.infer<typeof activityTypeSchema>) {
    setIsSubmitting(true);
    const token = await auth?.currentUser?.getIdToken();

    if (!token) {
      toast.error(t("error.authenticationFailed"));
      setIsSubmitting(false);
      return;
    }

    const response = await saveNewActivityType(data, token, locale);

    if (response.error || !response.activityTypeId) {
      toast.error(
        t("error.savingActivityType", {
          error: response.error || "Unknown error",
        })
      );
      setIsSubmitting(false);
      return;
    }

    if (response?.success) {
      toast.success(t("success.activityTypeSaved"));
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
            <CirclePlusIcon className="size-4" />
            {t("createActivityTypeButton")}
          </>
        }
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
