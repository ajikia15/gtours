"use client";
import { useAuth } from "@/context/auth";
import { blogSchema } from "@/validation/blogSchema";
import { PencilIcon } from "lucide-react";
import { z } from "zod";
import { editBlog, saveBlogImages } from "../../actions";
import BlogForm from "@/components/blog-form";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { Blog } from "@/types/Blog";
import {
  deleteObject,
  ref,
  uploadBytesResumable,
  UploadTask,
} from "firebase/storage";
import { storage } from "@/firebase/client";
import { useTranslations } from "next-intl";

type Props = Blog;

export default function EditBlogForm({
  id,
  title,
  description,
  author,
  publishedDate,
  categories,
  status,
  featuredImage,
  images = [],
  seoMeta,
}: Props) {
  const auth = useAuth();
  const router = useRouter();
  const t = useTranslations("Admin.blogForm");

  async function handleSubmit(data: z.infer<typeof blogSchema>) {
    const token = await auth?.currentUser?.getIdToken();
    if (!token) {
      return;
    }

    const { images: newImages, ...rest } = data;
    const response = await editBlog(rest, id, token);
    if (!!response?.error) {
      toast.error(t("messages.errorSaving"));
      return;
    }
    const storageTasks: (UploadTask | Promise<void>)[] = [];
    const imagesToDelete = images.filter(
      (image) => !newImages.some((newImage) => image === newImage.url)
    );
    imagesToDelete.forEach((image) => {
      storageTasks.push(deleteObject(ref(storage, image)));
    });

    const paths: string[] = [];
    newImages.forEach((image, index) => {
      if (image.file) {
        const path = `blogs/${id}/${Date.now()}-${index}-${image.file.name}`;
        paths.push(path);
        const storageRef = ref(storage, path);
        storageTasks.push(uploadBytesResumable(storageRef, image.file));
      } else {
        paths.push(image.url);
      }
    });

    await Promise.all(storageTasks);
    await saveBlogImages(
      {
        blogId: id,
        images: paths,
        featuredImage: paths[0] || undefined, // Use first image as featured
      },
      token
    );

    toast.success(t("messages.savedSuccessfully"));
    router.push("/admin"); // TODO: redirect to the blog details
  }

  return (
    <div>
      <BlogForm
        handleSubmit={handleSubmit}
        submitButtonLabel={
          <>
            <PencilIcon className="size-4" />
            {t("updateBlog")}
          </>
        }
        defaultValues={{
          title,
          description,
          author,
          publishedDate,
          categories,
          status,
          featuredImage: featuredImage || "",
          images: images.map((image) => ({
            id: image,
            url: image,
          })),
          seoMeta: seoMeta || {
            metaDescription: ["", "", ""],
            keywords: [],
          },
        }}
      />
    </div>
  );
}
