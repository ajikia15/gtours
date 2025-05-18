"use client";
import { useAuth } from "@/context/auth";
import { tourDataSchema } from "@/validation/tourSchema";
import { CirclePlusIcon } from "lucide-react";
import { z } from "zod";
import { saveNewTour } from "../actions";
import TourForm from "@/components/tour-form";
import { toast } from "sonner";
export default function NewTourForm() {
  const auth = useAuth();
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
    }
    console.log({ result });
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
