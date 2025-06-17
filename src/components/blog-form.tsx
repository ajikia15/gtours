"use client";

import { blogSchema, blogStatusEnum } from "@/validation/blogSchema";
import { useForm } from "react-hook-form";
import { Form } from "./ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MultiImageUploader, { ImageUpload } from "./multi-image-uploader";
import { useTranslations } from "next-intl";
import { Badge } from "./ui/badge";
import { X } from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";

// Define the BlogFormData type directly from the schema
type BlogFormData = z.infer<typeof blogSchema>;

type Props = {
  handleSubmit: (data: BlogFormData) => void;
  submitButtonLabel: React.ReactNode;
  defaultValues?: BlogFormData;
};

export default function BlogForm({
  handleSubmit: onSubmit,
  submitButtonLabel,
  defaultValues,
}: Props) {
  const t = useTranslations("Admin.blogForm");
  const [newCategory, setNewCategory] = useState("");
  const [newKeyword, setNewKeyword] = useState("");
  const [seoOpen, setSeoOpen] = useState(false);
  const combinedDefaultValues: z.infer<typeof blogSchema> = {
    ...defaultValues,
    title: defaultValues?.title || ["", "", ""], // [EN, GE, RU]
    description: defaultValues?.description || ["", "", ""], // [EN, GE, RU]
    author: defaultValues?.author || "",
    publishedDate: defaultValues?.publishedDate || new Date(),
    categories: defaultValues?.categories || [],
    featuredImage: defaultValues?.featuredImage || "",
    status: defaultValues?.status || "draft",
    images: defaultValues?.images || [],
    seoMeta: defaultValues?.seoMeta || {
      metaDescription: ["", "", ""],
      keywords: [],
    },
  };

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: combinedDefaultValues,
  });

  const addCategory = () => {
    if (newCategory.trim()) {
      const currentCategories = form.getValues("categories");
      if (!currentCategories.includes(newCategory.trim())) {
        form.setValue("categories", [...currentCategories, newCategory.trim()]);
      }
      setNewCategory("");
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    const currentCategories = form.getValues("categories");
    form.setValue(
      "categories",
      currentCategories.filter((cat) => cat !== categoryToRemove)
    );
  };

  const addKeyword = () => {
    if (newKeyword.trim()) {
      const currentKeywords = form.getValues("seoMeta.keywords") || [];
      if (!currentKeywords.includes(newKeyword.trim())) {
        form.setValue("seoMeta.keywords", [
          ...currentKeywords,
          newKeyword.trim(),
        ]);
      }
      setNewKeyword("");
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    const currentKeywords = form.getValues("seoMeta.keywords") || [];
    form.setValue(
      "seoMeta.keywords",
      currentKeywords.filter((keyword) => keyword !== keywordToRemove)
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* 1. BASIC INFORMATION */}
        <fieldset disabled={form.formState.isSubmitting} className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {t("sections.basicInformation")}
            </h3>
            <p className="text-sm text-gray-500">
              {t("sections.basicInformationDesc")}
            </p>
          </div>

          {/* Title Fields */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title.0"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.titleEN")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("fields.titleENPlaceholder")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title.1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.titleGE")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("fields.titleGEPlaceholder")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title.2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.titleRU")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("fields.titleRUPlaceholder")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Description Fields */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="description.0"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.descriptionEN")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={3}
                      placeholder={t("fields.descriptionENPlaceholder")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description.1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.descriptionGE")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={3}
                      placeholder={t("fields.descriptionGEPlaceholder")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description.2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.descriptionRU")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={3}
                      placeholder={t("fields.descriptionRUPlaceholder")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />          </div>
        </fieldset>

        {/* 2. BLOG DETAILS */}
        <fieldset disabled={form.formState.isSubmitting} className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {t("sections.blogDetails")}
            </h3>
            <p className="text-sm text-gray-500">
              {t("sections.blogDetailsDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.author")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("fields.authorPlaceholder")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="publishedDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.publishedDate")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="datetime-local"
                      value={
                        field.value instanceof Date
                          ? field.value.toISOString().slice(0, 16)
                          : field.value
                      }
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <FormLabel>{t("fields.categories")}</FormLabel>
            <div className="flex gap-2">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder={t("fields.categoryPlaceholder")}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addCategory())
                }
              />
              <Button type="button" onClick={addCategory} variant="outline">
                {t("fields.addCategory")}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.watch("categories").map((category, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {category}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeCategory(category)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </fieldset>

        {/* 3. ADMINISTRATIVE */}
        <fieldset disabled={form.formState.isSubmitting} className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {t("sections.status")}
            </h3>
            <p className="text-sm text-gray-500">{t("sections.statusDesc")}</p>
          </div>

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="max-w-xs">
                <FormLabel>{t("fields.blogStatus")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("fields.selectStatusPlaceholder")}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {blogStatusEnum.options.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

        {/* 4. VISUAL CONTENT */}
        <fieldset disabled={form.formState.isSubmitting} className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {t("sections.images")}
            </h3>
            <p className="text-sm text-gray-500">{t("sections.imagesDesc")}</p>
          </div>

          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <MultiImageUploader
                    onImagesChange={(images: ImageUpload[]) => {
                      form.setValue("images", images);
                    }}
                    images={field.value}
                    urlFormatter={(image) => {
                      if (!image.file) {
                        return `https://firebasestorage.googleapis.com/v0/b/gtours-fcd56.firebasestorage.app/o/${encodeURIComponent(
                          image.url
                        )}?alt=media`;
                      }
                      return image.url;
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

        {/* 5. SEO META (COLLAPSIBLE) */}
        <Collapsible open={seoOpen} onOpenChange={setSeoOpen}>
          <CollapsibleTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="w-full flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-2">
                {seoOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <span className="text-lg font-medium">
                  {t("sections.seoMeta")}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {t("sections.seoMetaDesc")}
              </span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            <fieldset
              disabled={form.formState.isSubmitting}
              className="space-y-4"
            >
              {/* Meta Description Fields */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="seoMeta.metaDescription.0"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.metaDescriptionEN")}</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={2}
                          placeholder={t("fields.metaDescriptionENPlaceholder")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="seoMeta.metaDescription.1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.metaDescriptionGE")}</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={2}
                          placeholder={t("fields.metaDescriptionGEPlaceholder")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="seoMeta.metaDescription.2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.metaDescriptionRU")}</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={2}
                          placeholder={t("fields.metaDescriptionRUPlaceholder")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Keywords */}
              <div className="space-y-3">
                <FormLabel>{t("fields.seoKeywords")}</FormLabel>
                <div className="flex gap-2">
                  <Input
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder={t("fields.keywordPlaceholder")}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addKeyword())
                    }
                  />
                  <Button type="button" onClick={addKeyword} variant="outline">
                    {t("fields.addKeyword")}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(form.watch("seoMeta.keywords") || []).map(
                    (keyword, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {keyword}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeKeyword(keyword)}
                        />
                      </Badge>
                    )
                  )}
                </div>
              </div>
            </fieldset>
          </CollapsibleContent>
        </Collapsible>

        {/* SUBMIT BUTTON */}
        <div className="pt-6 border-t">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full"
            variant="brandred"
            size="lg"
          >
            {submitButtonLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
