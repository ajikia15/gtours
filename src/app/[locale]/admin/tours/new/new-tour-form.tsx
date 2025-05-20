"use client";
import { useAuth } from "@/context/auth";
import { tourSchema } from "@/validation/tourSchema";
import { CirclePlusIcon } from "lucide-react";
import { z } from "zod";
import { saveNewTour, saveTourImages } from "../actions";
import TourForm from "@/components/tour-form";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { ref, uploadBytesResumable, UploadTask } from "@firebase/storage";
import { storage } from "@/firebase/client";
export default function NewTourForm() {
  const auth = useAuth();
  const router = useRouter();
  async function handleSubmit(data: z.infer<typeof tourSchema>) {
    const token = await auth?.currentUser?.getIdToken();

    if (!token) {
      return;
    }
    const { images, ...rest } = data;
    const result = await saveNewTour(rest, token);
    if (!!result.error || !result.tourId) {
      toast.error("Error saving tour");
      return;
    }

    const uploadTasks: UploadTask[] = [];
    const paths: string[] = [];
    images.forEach((image, index) => {
      if (image.file) {
        const path = `tours/${result.tourId}/${Date.now()}-${index}-${
          image.file.name
        }`;
        paths.push(path);
        const storageRef = ref(storage, path);
        uploadTasks.push(uploadBytesResumable(storageRef, image.file));
      }
    });

    await Promise.all(uploadTasks);
    await saveTourImages(
      {
        tourId: result.tourId,
        images: paths,
      },
      token
    );
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
