"use client";
import PropertyForm from "@/components/property-form";
import { tourDataSchema } from "@/validation/tourSchema";
import { CirclePlusIcon } from "lucide-react";
import { z } from "zod";

export default function NewTourForm() {
  function handleSubmit(data: z.infer<typeof tourDataSchema>) {
    console.log({ data });
  }
  return (
    <div>
      <PropertyForm
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
