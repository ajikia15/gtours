import { getBlogs } from "@/data/blogs";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  TableFooter,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Link } from "@/i18n/navigation";
import { Eye, Pencil, Trash } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getLocalizedTitle } from "@/lib/localizationHelpers";
import { Badge } from "@/components/ui/badge";
import BlogStatusBadge from "@/components/blog-status-badge";

export default async function BlogsTable({
  page = 1,
  params = { locale: "en" },
}: {
  page?: number;
  params?: Promise<{ locale: string }> | { locale: string };
}) {
  // Ensure params is awaited
  const resolvedParams = await Promise.resolve(params);
  const locale = resolvedParams.locale;

  // Start both operations in parallel instead of sequentially
  const [translationsResult, blogsResult] = await Promise.all([
    getTranslations("Admin"),
    getBlogs({
      pagination: {
        page,
        pageSize: 10,
      },
    }),
  ]);

  const t = translationsResult;
  const { data, totalPages } = blogsResult;

  return (
    <>
      {!data?.length && (
        <div className="flex items-center justify-center h-full">
          <p className="text-sm text-muted-foreground">
            {t("dashboard.noBlogsFound")}
          </p>
        </div>
      )}
      {data?.length && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("blogTable.title")}</TableHead>
              <TableHead>{t("blogTable.author")}</TableHead>
              <TableHead>{t("blogTable.publishedDate")}</TableHead>
              <TableHead>{t("blogTable.categories")}</TableHead>
              <TableHead>{t("blogTable.status")}</TableHead>
              <TableHead>{t("blogTable.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell>{getLocalizedTitle(blog, locale)}</TableCell>
                <TableCell>{blog.author}</TableCell>
                <TableCell>
                  {blog.publishedDate instanceof Date
                    ? blog.publishedDate.toLocaleDateString()
                    : new Date(blog.publishedDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {blog.categories.slice(0, 2).map((category, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                    {blog.categories.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{blog.categories.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <BlogStatusBadge status={blog.status} />
                </TableCell>
                <TableCell className="flex items-center gap-1">
                  <Link href={`/blog/${blog.id}`}>
                    <Button variant="outline" title={t("blogTable.view")}>
                      <Eye />
                    </Button>
                  </Link>
                  <Link href={`/admin/blogs/edit/${blog.id}`}>
                    <Button variant="outline" title={t("blogTable.edit")}>
                      <Pencil />
                    </Button>
                  </Link>

                  <Button variant="outline" title={t("blogTable.delete")}>
                    <Trash />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href={`/${locale}/admin/blogs?page=${
                          page > 1 ? page - 1 : 1
                        }`}
                        aria-disabled={page <= 1}
                        className={
                          page <= 1 ? "pointer-events-none opacity-50" : ""
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href={`/${locale}/admin/blogs?page=${i + 1}`}
                          isActive={page === i + 1}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href={`/${locale}/admin/blogs?page=${
                          page < totalPages ? page + 1 : totalPages
                        }`}
                        aria-disabled={page >= totalPages}
                        className={
                          page >= totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </>
  );
}
