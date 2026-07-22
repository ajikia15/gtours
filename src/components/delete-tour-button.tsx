"use client";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useAuth } from "@/context/auth";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { deleteTour } from "@/app/[locale]/admin/tours/actions";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "@/firebase/client";
import * as React from "react";
import { useTranslations } from "next-intl";

export default function DeleteTourButton({
  tourId,
  images,
  title,
}: {
  tourId: string;
  images?: string[];
  title?: string;
}) {
  const auth = useAuth();
  const router = useRouter();
  const t = useTranslations("Booking");
  const tCommon = useTranslations("Common");
  const [loading, setLoading] = React.useState(false);
  const displayTitle = title ?? tCommon("delete");

  async function handleDelete() {
    if (loading) return;
    const confirmed = window.confirm(t("confirmDeleteTour"));
    if (!confirmed) return;

    setLoading(true);
    try {
      const token = await auth?.currentUser?.getIdToken();
      if (!token) {
        toast.error(t("notAuthorized"));
        setLoading(false);
        return;
      }

      // Delete images first (best-effort)
      if (images?.length) {
        await Promise.allSettled(
          images.map((path) => deleteObject(ref(storage, path)))
        );
      }

      const res = await deleteTour(tourId, token);
      if ((res as any)?.error) {
        toast.error((res as any)?.message || t("failedDeleteTour"));
        setLoading(false);
        return;
      }

      toast.success(t("tourDeleted"));
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error(t("failedDeleteTour"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      title={displayTitle}
      onClick={handleDelete}
      disabled={loading}
    >
      <Trash />
    </Button>
  );
}
