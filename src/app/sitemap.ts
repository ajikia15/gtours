import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getPublishedTours } from "@/data/tours";
import { getPublishedBlogs } from "@/data/blogs";

const baseUrl = (process.env.NEXTAUTH_URL || "http://localhost:3000").replace(
  /\/$/,
  ""
);

const locales = routing.locales;

function localizedEntry(
  path: string,
  options?: {
    lastModified?: Date;
    changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority?: number;
  }
): MetadataRoute.Sitemap[number] {
  const languages = Object.fromEntries(
    locales.map((locale) => [locale, `${baseUrl}/${locale}${path}`])
  );

  return {
    url: `${baseUrl}/${routing.defaultLocale}${path}`,
    lastModified: options?.lastModified,
    changeFrequency: options?.changeFrequency,
    priority: options?.priority,
    alternates: { languages },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    localizedEntry("", { changeFrequency: "daily", priority: 1 }),
    localizedEntry("/destinations", {
      changeFrequency: "daily",
      priority: 0.9,
    }),
    localizedEntry("/blog", { changeFrequency: "weekly", priority: 0.8 }),
    localizedEntry("/about", { changeFrequency: "monthly", priority: 0.5 }),
    localizedEntry("/contact", { changeFrequency: "monthly", priority: 0.5 }),
    localizedEntry("/privacy", { changeFrequency: "yearly", priority: 0.3 }),
    localizedEntry("/terms", { changeFrequency: "yearly", priority: 0.3 }),
  ];

  const dynamicEntries: MetadataRoute.Sitemap = [];

  try {
    const { data: tours } = await getPublishedTours();
    for (const tour of tours) {
      dynamicEntries.push(
        localizedEntry(`/tour/${tour.id}`, {
          changeFrequency: "weekly",
          priority: 0.7,
        })
      );
    }
  } catch (error) {
    console.error("sitemap: failed to load tours", error);
  }

  try {
    const { data: blogs } = await getPublishedBlogs({
      pagination: { page: 1, pageSize: 1000 },
    });
    for (const blog of blogs) {
      dynamicEntries.push(
        localizedEntry(`/blog/${blog.id}`, {
          lastModified: blog.publishedDate
            ? new Date(blog.publishedDate)
            : undefined,
          changeFrequency: "monthly",
          priority: 0.6,
        })
      );
    }
  } catch (error) {
    console.error("sitemap: failed to load blogs", error);
  }

  return [...staticEntries, ...dynamicEntries];
}
