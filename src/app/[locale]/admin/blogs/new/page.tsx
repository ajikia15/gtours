import { Breadcrumbs } from "@/components/ui/breadcrumb";
import NewBlogForm from "./new-blog-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

export default async function NewBlog() {
  const t = await getTranslations("Admin");

  return (
    <div className="max-w-4xl mx-auto mt-5">
      <Breadcrumbs
        items={[
          { label: t("breadcrumbs.adminDashboard"), href: "/admin" },
          { label: t("breadcrumbs.blogs") },
          { label: t("breadcrumbs.newBlog") },
        ]}
      />

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>{t("blogForm.newBlog")}</CardTitle>
        </CardHeader>
        <CardContent>
          <NewBlogForm />
        </CardContent>
      </Card>
    </div>
  );
}
