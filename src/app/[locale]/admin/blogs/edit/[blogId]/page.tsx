import { Breadcrumbs } from "@/components/ui/breadcrumb";
import EditBlogForm from "./edit-blog-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBlogById } from "@/data/blogs";
import { getLocalizedTitle } from "@/lib/localizationHelpers";
import { getLocale, getTranslations } from "next-intl/server";

export default async function EditBlog({
  params,
}: {
  params: Promise<{ blogId: string }>;
}) {
  const { blogId } = await params;
  const blog = await getBlogById(blogId);
  const locale = await getLocale();
  const t = await getTranslations("Admin");
  return (
    <div className="max-w-4xl mx-auto mt-5">
      <Breadcrumbs
        items={[
          { label: t("breadcrumbs.adminDashboard"), href: "/admin" },
          { label: t("breadcrumbs.blogs") },
          { label: t("breadcrumbs.editBlog") },
        ]}
      />

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>
            {t("blogForm.editBlog")} - {getLocalizedTitle(blog, locale)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {" "}
          <EditBlogForm
            id={blog.id}
            title={blog.title}
            description={blog.description}
            author={blog.author}
            publishedDate={blog.publishedDate}
            categories={blog.categories}
            status={blog.status}
            featuredImage={blog.featuredImage}
            images={blog.images || []}
            seoMeta={blog.seoMeta}
          />
        </CardContent>
      </Card>
    </div>
  );
}
