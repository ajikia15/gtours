"use client";
import { useAuth } from "@/context/auth";
import { tourSchema } from "@/validation/tourSchema";
import { PencilIcon } from "lucide-react";
import { z } from "zod";
import { editTour, saveNewTour } from "../../actions";
import TourForm from "@/components/tour-form";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { Tour } from "@/types/Tour";
type Props = Tour;

export default function EditTourForm({
  id,
  title,
  description,
  imageUrl,
  basePrice,
  duration,
  leaveTime,
  returnTime,
  location,
  status,
  images = [],
}: Props) {
  const auth = useAuth();
  const router = useRouter();
  async function handleSubmit(data: z.infer<typeof tourSchema>) {
    const token = await auth?.currentUser?.getIdToken();
    if (!token) {
      return;
    }

    const { images, ...rest } = data;
    console.log(rest);
    const response = await editTour(rest, id, token);

    toast.success("Tour saved successfully");
    router.push("/admin"); // TODO: redirect to the new tour
  }
  return (
    <div>
      <TourForm
        handleSubmit={handleSubmit}
        submitButtonLabel={
          <>
            <PencilIcon className="size-4" />
            Update Tour
          </>
        }
        defaultValues={{
          title,
          description,
          imageUrl,
          basePrice,
          duration,
          leaveTime,
          returnTime,
          location,
          status,
          images: images.map((image) => ({
            id: image,
            url: image,
          })),
        }}
      />
    </div>
  );
}
