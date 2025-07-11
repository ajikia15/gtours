import { getBlogById, getPublishedBlogs } from "@/data/blogs";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import {
  getLocalizedTitle,
  getLocalizedDescription,
  getLocalizedBlogMetaDescription,
} from "@/lib/localizationHelpers";
import Image from "next/image";
import { getImageUrl } from "@/lib/imageHelpers";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, UserIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import BlogCard from "@/components/blog-card";

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

    // Get similar blogs (4 blogs, excluding current blog)
    const { data: allBlogs } = await getPublishedBlogs({
      pagination: { page: 1, pageSize: 5 },
    });
    const similarBlogs = allBlogs.filter(b => b.id !== blogId).slice(0, 4);

    // Get the first image (featured or first from images array)
    const mainImage = blog.featuredImage || blog.images?.[0];
    const publishedDate = blog.publishedDate instanceof Date
      ? blog.publishedDate
      : new Date(blog.publishedDate);

    const day = publishedDate.getDate().toString().padStart(2, "0");
    const month = (publishedDate.getMonth() + 1).toString().padStart(2, "0");
    const year = publishedDate.getFullYear();

    return (
      <div className="max-w-7xl mx-auto py-12 px-6">
        {/* Header with Image and Date - Full Width */}
        <div className="mb-8">
          <div className="flex mb-6">
            {/* Main Image */}
            <div className="w-11/12 aspect-video">
              {mainImage && (
                <Image
                  src={getImageUrl(mainImage)}
                  alt={title}
                  width={800}
                  height={450}
                  className="rounded-sm w-full h-full object-cover"
                  priority
                />
              )}
            </div>
            {/* Date Column */}
            <ul className="grid w-1/12 grid-rows-3 px-3">
              <li className="grid place-items-center border-t border-zinc-300 font-bold text-sm">
                {day}
              </li>
              <li className="grid place-items-center border-y border-zinc-300 text-sm">
                {month}
              </li>
              <li className="grid place-items-center border-b border-zinc-300 text-sm">
                {year}
              </li>
            </ul>
          </div>
        </div>

        {/* Content Layout - Title and Text with Sidebar */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
          {/* Left Column - Main Content */}
          <div className="xl:col-span-2">
            {/* Title */}
            <h1 className="text-4xl font-bold mb-6 text-gray-900">{title}</h1>

            {/* Meta information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span>{publishedDate.toLocaleDateString(locale)}</span>
              </div>
            </div>

            {/* Categories */}
            {blog.categories && blog.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {blog.categories.map((category) => (
                  <Badge key={category} variant="secondary">
                    {category}
                  </Badge>
                ))}
              </div>
            )}

            {/* Main Content - ReactMarkdown */}
            <article className="tour-description prose prose-lg max-w-none">
              <ReactMarkdown>{description}</ReactMarkdown>
            </article>

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
          </div>

          {/* Right Column - Similar Blogs */}
          <div className="xl:col-span-1">
            <div className="sticky top-6">
              <h3 className="text-xl font-semibold mb-6 text-gray-900">
                {t("similarBlogs")}
              </h3>
              
              {/* Vertical Scrollable Container */}
              <div className="max-h-[800px] overflow-y-auto space-y-2 pr-2">
                {similarBlogs.map((similarBlog) => (
                  <div key={similarBlog.id} className="transform scale-90 origin-top -mb-6">
                    <BlogCard blog={similarBlog} />
                  </div>
                ))}
                
                {similarBlogs.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>{t("noSimilarBlogs")}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
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
