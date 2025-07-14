"use client";

import { ratingSchema, ratingStatusEnum } from "@/validation/ratingSchema";
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
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "./ui/textarea";
import { useTranslations } from "next-intl";
import { Badge } from "./ui/badge";

type Props = {
  handleSubmit: (data: z.infer<typeof ratingSchema>) => Promise<void>;
  submitButtonLabel: React.ReactNode;
  defaultValues?: Partial<z.infer<typeof ratingSchema>>;
};

const LanguageTabTrigger = ({
  value,
  label,
  isEmpty,
}: {
  value: string;
  label: string;
  isEmpty: boolean;
}) => (
  <TabsTrigger value={value} className="relative">
    {label}
    {isEmpty && (
      <Badge variant="destructive" className="ml-2 h-4 w-4 p-0 text-xs">
        !
      </Badge>
    )}
  </TabsTrigger>
);

export default function RatingForm({
  handleSubmit: onSubmit,
  submitButtonLabel,
  defaultValues,
}: Props) {
  const t = useTranslations("Admin.ratingForm");
  const combinedDefaultValues: z.infer<typeof ratingSchema> = {
    ...defaultValues,
    title: defaultValues?.title || ["", "", ""], // [EN, GE, RU]
    review: defaultValues?.review || ["", "", ""], // [EN, GE, RU]
    author: defaultValues?.author || "",
    rating: defaultValues?.rating || 5,
    createdDate: defaultValues?.createdDate || new Date(),
    status: defaultValues?.status || "draft",
    tourId: defaultValues?.tourId || "",
  };

  const form = useForm<z.infer<typeof ratingSchema>>({
    resolver: zodResolver(ratingSchema),
    defaultValues: combinedDefaultValues,
  });

  const watchedTitles = form.watch("title");
  const watchedReviews = form.watch("review");

  const isLanguageEmpty = (langIndex: number) => {
    const titleEmpty = !watchedTitles[langIndex]?.trim();
    const reviewEmpty = !watchedReviews[langIndex]?.trim();
    return titleEmpty || reviewEmpty;
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative space-y-8"
      >
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

          {/* Global Language Tab Switcher - Sticky */}
          <Tabs defaultValue="en" className="w-full">
            <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-sm border-b shadow-sm rounded-md mb-6 pb-2 pt-2 px-2">
              <TabsList>
                <LanguageTabTrigger
                  value="en"
                  label="English"
                  isEmpty={isLanguageEmpty(0)}
                />
                <LanguageTabTrigger
                  value="ge"
                  label="Georgian"
                  isEmpty={isLanguageEmpty(1)}
                />
                <LanguageTabTrigger
                  value="ru"
                  label="Russian"
                  isEmpty={isLanguageEmpty(2)}
                />
              </TabsList>
            </div>

            {/* English Fields */}
            <TabsContent value="en" className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-700">
                  Rating Title
                </h4>
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
              </div>

              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-700">
                  Review
                </h4>
                <FormField
                  control={form.control}
                  name="review.0"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.reviewEN")}</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder={t("fields.reviewENPlaceholder")}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            {/* Georgian Fields */}
            <TabsContent value="ge" className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-700">
                  Rating Title
                </h4>
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
              </div>

              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-700">
                  Review
                </h4>
                <FormField
                  control={form.control}
                  name="review.1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.reviewGE")}</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder={t("fields.reviewGEPlaceholder")}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            {/* Russian Fields */}
            <TabsContent value="ru" className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-700">
                  Rating Title
                </h4>
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

              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-700">
                  Review
                </h4>
                <FormField
                  control={form.control}
                  name="review.2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.reviewRU")}</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder={t("fields.reviewRUPlaceholder")}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
          </Tabs>
        </fieldset>

        {/* 2. RATING DETAILS */}
        <fieldset disabled={form.formState.isSubmitting} className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {t("sections.ratingDetails")}
            </h3>
            <p className="text-sm text-gray-500">
              {t("sections.ratingDetailsDesc")}
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
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.rating")}</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("fields.ratingPlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1 ⭐</SelectItem>
                      <SelectItem value="2">2 ⭐⭐</SelectItem>
                      <SelectItem value="3">3 ⭐⭐⭐</SelectItem>
                      <SelectItem value="4">4 ⭐⭐⭐⭐</SelectItem>
                      <SelectItem value="5">5 ⭐⭐⭐⭐⭐</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="createdDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.createdDate")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      value={
                        field.value instanceof Date
                          ? field.value.toISOString().split("T")[0]
                          : field.value
                      }
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tourId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.tourId")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("fields.tourIdPlaceholder")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </fieldset>

        {/* 3. STATUS */}
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
                <FormLabel>{t("fields.ratingStatus")}</FormLabel>
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
                    {ratingStatusEnum.options.map((status) => (
                      <SelectItem key={status} value={status}>
                        {t(`status.${status}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

        {/* SUBMIT BUTTON */}
        <div className="pt-6 border-t">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full md:w-auto"
          >
            {form.formState.isSubmitting && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            )}
            {submitButtonLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
