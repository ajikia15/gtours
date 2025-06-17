"use client";
import { useAuth } from "@/context/auth";
import { blogSchema } from "@/validation/blogSchema";
import { CirclePlusIcon } from "lucide-react";
import { z } from "zod";
import { saveNewBlog, saveBlogImages } from "../actions";
import BlogForm from "@/components/blog-form";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { ref, uploadBytesResumable, UploadTask } from "@firebase/storage";
import { storage } from "@/firebase/client";
import { useTranslations } from "next-intl";

export default function NewBlogForm() {
  const auth = useAuth();
  const router = useRouter();
  const t = useTranslations("Admin.blogForm");

  async function handleSubmit(data: z.infer<typeof blogSchema>) {
    const token = await auth?.currentUser?.getIdToken();

    if (!token) {
      return;
    }
    const { images, ...rest } = data;
    const response = await saveNewBlog(rest, token);
    if (!!response.error || !response.blogId) {
      toast.error(t("messages.errorSaving"));
      return;
    }

    const uploadTasks: UploadTask[] = [];
    const paths: string[] = [];
    images.forEach((image, index) => {
      if (image.file) {
        const path = `blogs/${response.blogId}/${Date.now()}-${index}-${
          image.file.name
        }`;
        paths.push(path);
        const storageRef = ref(storage, path);
        uploadTasks.push(uploadBytesResumable(storageRef, image.file));
      }
    });

    await Promise.all(uploadTasks);
    await saveBlogImages(
      {
        blogId: response.blogId,
        images: paths,
        featuredImage: paths[0] || undefined, // Use first image as featured
      },
      token
    );
    if (response?.success) {
      toast.success(t("messages.savedSuccessfully"));
      router.push("/admin"); // TODO: redirect to the new blog
    }
  }
  return (
    <div>
      <BlogForm
        handleSubmit={handleSubmit}
        submitButtonLabel={
          <>
            <CirclePlusIcon className="size-4" />
            {t("createBlog")}
          </>
        }
      />
    </div>
  );
}
