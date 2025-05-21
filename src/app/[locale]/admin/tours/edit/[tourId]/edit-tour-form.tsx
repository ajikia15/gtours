"use client";
import { useAuth } from "@/context/auth";
import { tourSchema } from "@/validation/tourSchema";
import { PencilIcon } from "lucide-react";
import { z } from "zod";
import { editTour, saveNewTour, saveTourImages } from "../../actions";
import TourForm from "@/components/tour-form";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { Tour } from "@/types/Tour";
import {
  deleteObject,
  ref,
  uploadBytesResumable,
  UploadTask,
} from "firebase/storage";
import { storage } from "@/firebase/client";
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

    const { images: newImages, ...rest } = data;
    console.log(rest);
    const response = await editTour(rest, id, token);
    if (!!response?.error) {
      toast.success("sexfully updated");
      return;
    }
    const storageTasks: (UploadTask | Promise<void>)[] = [];
    const imagesToDelete = images.filter((image) =>
      newImages.find((newImage) => image === newImage.url)
    );
    imagesToDelete.forEach((image) => {
      storageTasks.push(deleteObject(ref(storage, image)));
    });

    const paths: string[] = [];
    newImages.forEach((image, index) => {
      if (image.file) {
        const path = `tours/${id}/${Date.now()}-${index}-${image.file.name}`;
        paths.push(path);
        const storageRef = ref(storage, path);
        storageTasks.push(uploadBytesResumable(storageRef, image.file));
      } else {
        paths.push(image.url);
      }
    });

    await Promise.all(storageTasks);
    await saveTourImages({ tourId: id, images: paths }, token);
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
