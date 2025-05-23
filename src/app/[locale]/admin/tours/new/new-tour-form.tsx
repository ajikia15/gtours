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
import { useTranslations } from "next-intl";

export default function NewTourForm() {
  const auth = useAuth();
  const router = useRouter();
  const t = useTranslations("Admin.tourForm");

  async function handleSubmit(data: z.infer<typeof tourSchema>) {
    const token = await auth?.currentUser?.getIdToken();

    if (!token) {
      return;
    }
    const { images, ...rest } = data;
    const response = await saveNewTour(rest, token);
    if (!!response.error || !response.tourId) {
      toast.error(t("messages.errorSaving"));
      return;
    }

    const uploadTasks: UploadTask[] = [];
    const paths: string[] = [];
    images.forEach((image, index) => {
      if (image.file) {
        const path = `tours/${response.tourId}/${Date.now()}-${index}-${
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
        tourId: response.tourId,
        images: paths,
      },
      token
    );
    if (response?.success) {
      toast.success(t("messages.savedSuccessfully"));
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
            {t("createTour")}
          </>
        }
      />
    </div>
  );
}
