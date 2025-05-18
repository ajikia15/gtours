"use client";
import { useAuth } from "@/context/auth";
import { tourDataSchema } from "@/validation/tourSchema";
import { CirclePlusIcon } from "lucide-react";
import { z } from "zod";
import { saveNewTour } from "../actions";
import TourForm from "@/components/tour-form";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
export default function NewTourForm() {
  const auth = useAuth();
  const router = useRouter();
  async function handleSubmit(data: z.infer<typeof tourDataSchema>) {
    const token = await auth?.currentUser?.getIdToken();
    if (!token) {
      return;
    }
    const result = await saveNewTour(data, token);
    if (result?.error) {
      toast.error("Error saving tour");
    }
    if (result?.success) {
      toast.success("Tour saved successfully");
      router.push("/admin"); // TODO: redirect to the new tour
    }
  }
  return (
    <div>
      <TourForm
        handleSubmit={handleSubmit}
        submitButtonLabel={
          <>
            <CirclePlusIcon className="size-4" />
            Create Tour
          </>
        }
      />
    </div>
  );
}
