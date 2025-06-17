import { getBlogById } from "@/data/blogs";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import {
  getLocalizedTitle,
  getLocalizedDescription,
  getLocalizedBlogContent,
  getLocalizedBlogMetaDescription,
} from "@/lib/localizationHelpers";
import Image from "next/image";
import { getImageUrl } from "@/lib/imageHelpers";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, UserIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ blogId: string }>;
}) {
  const { blogId } = await params;
  const locale = await getLocale();
  const t = await getTranslations("Pages.blog");

  try {
    const blog = await getBlogById(blogId);

    // Only show published blogs to public users
    if (blog.status !== "published") {
      notFound();
    }
    const title = getLocalizedTitle(blog, locale);
    const description = getLocalizedDescription(blog, locale);
    const content = getLocalizedBlogContent(blog, locale);

    return (
      <article className="max-w-4xl mx-auto py-12 px-6">
        {/* Header */}
        <header className="mb-8">
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">{title}</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Meta information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>
                {blog.publishedDate instanceof Date
                  ? blog.publishedDate.toLocaleDateString(locale)
                  : new Date(blog.publishedDate).toLocaleDateString(locale)}
              </span>
            </div>
          </div>

          {/* Categories */}
          {blog.categories && blog.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {blog.categories.map((category) => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>
          )}

          {/* Featured Image */}
          {blog.featuredImage && (
            <div className="mb-8">
              <Image
                src={getImageUrl(blog.featuredImage)}
                alt={title}
                width={800}
                height={400}
                className="w-full aspect-[2/1] object-cover rounded-lg"
                priority
              />
            </div>
          )}
        </header>
        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>{" "}
        {/* Additional Images */}
        {blog.images && blog.images.length > 1 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">{t("gallery")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {blog.images.slice(1).map((image, index) => (
                <Image
                  key={index}
                  src={getImageUrl(image)}
                  alt={`${title} - Image ${index + 2}`}
                  width={400}
                  height={300}
                  className="w-full aspect-[4/3] object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}
        {/* Keywords for SEO */}
        {blog.seoMeta?.keywords && blog.seoMeta.keywords.length > 0 && (
          <div className="mt-8 pt-8 border-t">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              {t("tags")}:
            </h4>
            <div className="flex flex-wrap gap-2">
              {blog.seoMeta.keywords.map((keyword) => (
                <Badge key={keyword} variant="outline" className="text-xs">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </article>
    );
  } catch (error) {
    console.error("Failed to fetch blog:", error);
    notFound();
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ blogId: string }>;
}) {
  const { blogId } = await params;
  const locale = await getLocale();

  try {
    const blog = await getBlogById(blogId);
    const title = getLocalizedTitle(blog, locale);
    const description = getLocalizedDescription(blog, locale);
    const metaDescription = blog.seoMeta?.metaDescription
      ? getLocalizedBlogMetaDescription(blog, locale)
      : description;

    return {
      title,
      description: metaDescription,
      keywords: blog.seoMeta?.keywords?.join(", "),
      openGraph: {
        title,
        description: metaDescription,
        type: "article",
        publishedTime:
          blog.publishedDate instanceof Date
            ? blog.publishedDate.toISOString()
            : new Date(blog.publishedDate).toISOString(),
        authors: [blog.author],
        tags: blog.categories,
        images: blog.featuredImage ? [getImageUrl(blog.featuredImage)] : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: metaDescription,
        images: blog.featuredImage ? [getImageUrl(blog.featuredImage)] : [],
      },
    };
  } catch {
    return {
      title: "Blog Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }
}
