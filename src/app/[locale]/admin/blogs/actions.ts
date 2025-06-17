"use server";
import { blogDataSchema } from "@/validation/blogSchema";
import { z } from "zod";
import { firestore } from "@/firebase/server";
import { verifyAdminToken } from "@/lib/auth-utils";

export const saveNewBlog = async (
  data: z.infer<typeof blogDataSchema>,
  token: string
) => {
  try {
    await verifyAdminToken(token);
  } catch (error) {
    console.error("Error verifying admin token in saveNewBlog:", error);
    return {
      error: "Unauthorized",
      message:
        error instanceof Error
          ? error.message
          : "Invalid or expired authentication token",
    };
  }

  const validation = blogDataSchema.safeParse(data);

  if (!validation.success) {
    return {
      error: "Invalid data",
      message: "Please check your data and try again",
    };
  }
  const blog = await firestore.collection("blogs").add({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return {
    blogId: blog.id,
    success: "Blog saved successfully",
    message: "Blog saved successfully",
  };
};

export const editBlog = async (
  data: z.infer<typeof blogDataSchema>,
  id: string,
  token: string
) => {
  try {
    await verifyAdminToken(token);
  } catch (error) {
    console.error("Error verifying admin token in editBlog:", error);
    return {
      error: "Unauthorized",
      message:
        error instanceof Error
          ? error.message
          : "Invalid or expired authentication token",
    };
  }

  const validation = blogDataSchema.safeParse(data);

  if (!validation.success) {
    return {
      error: "Invalid data",
      message: "Please check your data and try again",
    };
  }

  await firestore
    .collection("blogs")
    .doc(id)
    .update({
      ...data,
      updatedAt: new Date(),
    });
};

export const saveBlogImages = async (
  {
    blogId,
    images,
    featuredImage,
  }: {
    blogId: string;
    images: string[];
    featuredImage?: string;
  },
  token: string
) => {
  try {
    await verifyAdminToken(token);
  } catch (error) {
    console.error("Error verifying admin token in saveBlogImages:", error);
    return {
      error: "Unauthorized",
      message:
        error instanceof Error
          ? error.message
          : "Invalid or expired authentication token",
    };
  }

  const schema = z.object({
    blogId: z.string(),
    images: z.array(z.string()),
    featuredImage: z.string().optional(),
  });

  const validation = schema.safeParse({ blogId, images, featuredImage });
  if (!validation.success) {
    return {
      error: "Invalid data",
      message: "Please check your data and try again",
    };
  }

  const updateData: any = {
    images,
  };

  if (featuredImage !== undefined) {
    updateData.featuredImage = featuredImage;
  }

  await firestore.collection("blogs").doc(blogId).update(updateData);
};
