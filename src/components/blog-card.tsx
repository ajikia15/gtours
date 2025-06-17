import Image from "next/image";
import { useTranslations } from "next-intl";
import { Blog } from "@/types/Blog";
import {
  getLocalizedTitle,
  getLocalizedDescription,
} from "@/lib/localizationHelpers";
import { getImageUrl } from "@/lib/imageHelpers";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";

interface BlogCardProps {
  blog?: Blog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  const t = useTranslations("BlogCard");
  const locale = useLocale();

  // If no blog is provided, show placeholder
  if (!blog) {
    return (
      <div className="flex w-full flex-col gap-6 mb-20">
        <div className="flex">
          <div className="w-5/6 aspect-video">
            <Image
              src="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=2566&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Blog Image"
              width={100}
              height={100}
              className="rounded-sm w-full h-full object-cover"
            />
          </div>
          <ul className="grid w-1/6 grid-rows-3 px-6">
            <li className="grid place-items-center border-t border-zinc-300 font-bold">
              09
            </li>
            <li className="font grid place-items-center border-y border-zinc-300">
              05
            </li>
            <li className="font grid place-items-center border-b border-zinc-300">
              2025
            </li>
          </ul>
        </div>
        <div className="flex w-4/5 flex-col gap-4 px-6">
          <h2 className="text-xl font-bold text-zinc-800">
            {t("defaultTitle")}
          </h2>
          <p className="line-clamp-3">{t("defaultDescription")}</p>
          <p className="text-sm font-semibold text-red-500">
            {t("readMore")} &gt;
          </p>
        </div>
      </div>
    );
  }

  // Real blog data
  const title = getLocalizedTitle(blog, locale);
  const description = getLocalizedDescription(blog, locale);
  const publishedDate =
    blog.publishedDate instanceof Date
      ? blog.publishedDate
      : new Date(blog.publishedDate);

  const day = publishedDate.getDate().toString().padStart(2, "0");
  const month = (publishedDate.getMonth() + 1).toString().padStart(2, "0");
  const year = publishedDate.getFullYear();

  return (
    <Link
      href={`/blog/${blog.id}`}
      className="flex w-full flex-col gap-6 mb-20 transition-shadow"
    >
      <div className="flex">
        <div className="w-5/6 aspect-video">
          <Image
            src={
              blog.featuredImage
                ? getImageUrl(blog.featuredImage)
                : blog.images?.[0]
                ? getImageUrl(blog.images[0])
                : "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=2566&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            alt={title}
            width={100}
            height={100}
            className="rounded-sm w-full h-full object-cover"
          />
        </div>
        <ul className="grid w-1/6 grid-rows-3 px-6">
          <li className="grid place-items-center border-t border-zinc-300 font-bold">
            {day}
          </li>
          <li className="font grid place-items-center border-y border-zinc-300">
            {month}
          </li>
          <li className="font grid place-items-center border-b border-zinc-300">
            {year}
          </li>
        </ul>
      </div>
      <div className="flex w-4/5 flex-col gap-4">
        <h2 className="text-xl font-bold text-zinc-800">{title}</h2>
        <p className="line-clamp-3">{description}</p>
        <p className="text-sm font-semibold text-red-500">
          {t("readMore")} &gt;
        </p>
      </div>
    </Link>
  );
}
