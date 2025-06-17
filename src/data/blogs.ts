import "server-only";
import { firestore, getTotalPages } from "../firebase/server";
import { Blog } from "@/types/Blog";

type getBlogsOptions = {
  filters?: {
    status?: "published" | "draft" | "archived" | null;
    categories?: string[] | null;
    author?: string | null;
  };
  pagination?: {
    page?: number;
    pageSize?: number;
  };
};

// Helper function to migrate old blog data structure to new array structure
function migrateBlogData(data: any): Partial<Blog> {
  // Check if data is already in new format (arrays)
  if (Array.isArray(data?.title)) {
    return {
      title: data.title || ["", "", ""],
      description: data.description || ["", "", ""],
      author: data.author || "",
      publishedDate: data.publishedDate?.toDate() || new Date(),
      categories: data.categories || [],
      featuredImage: data.featuredImage || undefined,
      status: data.status || "draft",
      images: data.images || [],
      seoMeta: data.seoMeta || undefined,
    };
  }

  // Convert old format to new format (if needed for migration)
  return {
    title: [
      data?.title || data?.titleEN || "",
      data?.titleGE || "",
      data?.titleRU || "",
    ],
    description: [
      data?.description || data?.descriptionEN || "",
      data?.descriptionGE || "",
      data?.descriptionRU || "",
    ],
    author: data?.author || "",
    publishedDate: data?.publishedDate?.toDate() || new Date(),
    categories: data?.categories || [],
    featuredImage: data?.featuredImage || undefined,
    status: data?.status || "draft",
    images: data?.images || [],
    seoMeta: data?.seoMeta || undefined,
  };
}

export async function getBlogs(options?: getBlogsOptions) {
  const page = options?.pagination?.page || 1;
  const pageSize = options?.pagination?.pageSize || 10;
  const { status, categories, author } = options?.filters || {};

  let blogsQuery = firestore
    .collection("blogs")
    .orderBy("publishedDate", "desc");

  if (status) {
    blogsQuery = blogsQuery.where("status", "==", status);
  }
  if (author) {
    blogsQuery = blogsQuery.where("author", "==", author);
  }
  if (categories && categories.length > 0) {
    blogsQuery = blogsQuery.where(
      "categories",
      "array-contains-any",
      categories
    );
  }

  // Get blogs data first (this is fast)
  const blogsSnapshot = await blogsQuery
    .limit(pageSize)
    .offset((page - 1) * pageSize)
    .get();

  const blogs = blogsSnapshot.docs.map((doc) => {
    const data = doc.data();
    const migratedData = migrateBlogData(data);
    return {
      id: doc.id,
      ...migratedData,
    };
  }) as Blog[];

  // Only calculate total pages if specifically needed (adds ~2s delay)
  let totalPages = 1;
  if (options?.pagination?.page && options.pagination.page > 1) {
    // Only do expensive count query for pagination beyond first page
    totalPages = await getTotalPages(blogsQuery, pageSize);
  } else if (blogs.length === pageSize) {
    // If we got a full page, there's probably more - estimate
    totalPages = page + 1;
  }

  return { data: blogs, totalPages };
}

export async function getBlogById(blogId: string) {
  const blog = await firestore.collection("blogs").doc(blogId).get();
  const blogData = blog.data();

  const migratedData = migrateBlogData(blogData);

  // Create a clean, serializable version of the blog data
  const serializedBlog = {
    id: blog.id,
    ...migratedData,
  };

  return serializedBlog as Blog;
}

export async function getBlogsById(blogIds: string[]) {
  const blogs = await firestore
    .collection("blogs")
    .where("__name__", "in", blogIds)
    .get();
  return blogs.docs.map((doc) => {
    const data = doc.data();
    const migratedData = migrateBlogData(data);
    return {
      id: doc.id,
      ...migratedData,
    };
  }) as Blog[];
}

export async function getPublishedBlogs(options?: getBlogsOptions) {
  return getBlogs({
    ...options,
    filters: {
      ...options?.filters,
      status: "published",
    },
  });
}
