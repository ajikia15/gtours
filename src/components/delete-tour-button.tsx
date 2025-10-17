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

export default function DeleteTourButton({
  tourId,
  images,
  title = "Delete",
}: {
  tourId: string;
  images?: string[];
  title?: string;
}) {
  const auth = useAuth();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  async function handleDelete() {
    if (loading) return;
    const confirmed = window.confirm(
      "Are you sure you want to delete this tour?"
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const token = await auth?.currentUser?.getIdToken();
      if (!token) {
        toast.error("Not authorized");
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
        toast.error((res as any)?.message || "Failed to delete tour");
        setLoading(false);
        return;
      }

      toast.success("Tour deleted");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete tour");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      title={title}
      onClick={handleDelete}
      disabled={loading}
    >
      <Trash />
    </Button>
  );
}
