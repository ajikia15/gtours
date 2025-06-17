import { getTranslations } from "next-intl/server";
import BlogCard from "@/components/blog-card";
import { getPublishedBlogs } from "@/data/blogs";
import Header from "../header";

export default async function BlogPage() {
  const t = await getTranslations("Pages.blog");

  // Fetch published blogs
  const { data: blogs } = await getPublishedBlogs({
    pagination: { page: 1, pageSize: 12 },
  });

  return (
    <div className="py-12">
      <div className="text-center mb-16">
        <Header title={t("title")} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
        {blogs.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">{t("noBlogsFound")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
