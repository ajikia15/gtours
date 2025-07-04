"use client";

import { tourSchema, tourStatusEnum } from "@/validation/tourSchema";
import { useForm, useWatch } from "react-hook-form";
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
import { MDXEditor } from "./ui/mdx-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MultiImageUploader, { ImageUpload } from "./multi-image-uploader";
import ActivityManager from "./activity-manager";
import SchedulesManager from "./schedules-manager";
import { useCoordinatePaste } from "@/lib/useCoordinatePaste";
import { useTranslations } from "next-intl";

// Define the TourFormData type directly from the schema
type TourFormData = z.infer<typeof tourSchema>;

type Props = {
  handleSubmit: (data: TourFormData) => void;
  submitButtonLabel: React.ReactNode;
  defaultValues?: TourFormData;
};

// Helper component for tab triggers with empty field indicators
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
      <span
        className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white shadow-sm"
        title="Some fields in this language are empty"
      ></span>
    )}
  </TabsTrigger>
);

export default function TourForm({
  handleSubmit: onSubmit,
  submitButtonLabel,
  defaultValues,
}: Props) {
  const t = useTranslations("Admin.tourForm");
  const combinedDefaultValues: z.infer<typeof tourSchema> = {
    ...defaultValues,
    title: defaultValues?.title || ["", "", ""], // [EN, GE, RU]
    subtitle: defaultValues?.subtitle || ["", "", ""], // [EN, GE, RU]
    description: defaultValues?.description || ["", "", ""], // [EN, GE, RU]
    basePrice: defaultValues?.basePrice || 0,
    duration: defaultValues?.duration || 0,
    leaveTime: defaultValues?.leaveTime || "",
    returnTime: defaultValues?.returnTime || "",
    coordinates: defaultValues?.coordinates || [0, 0],
    status: defaultValues?.status || "draft",
    images: defaultValues?.images || [],
    offeredActivities: defaultValues?.offeredActivities || [],
    schedules: defaultValues?.schedules || [],
  };
  const form = useForm<TourFormData>({
    resolver: zodResolver(tourSchema),
    defaultValues: combinedDefaultValues,
  });
  // Smart paste functionality for coordinates
  const { handlePaste } = useCoordinatePaste(
    (lat) => form.setValue("coordinates.0", lat),
    (lng) => form.setValue("coordinates.1", lng)
  );
  // Watch all multilingual fields efficiently
  const watchedFields = useWatch({
    control: form.control,
    name: ["title", "subtitle", "description"],
  });

  const [title, subtitle, description] = watchedFields;

  // Helper to check if any field in a language is empty
  const isLanguageEmpty = (langIndex: number) => {
    const titleEmpty = !title?.[langIndex]?.trim();
    const subtitleEmpty = !subtitle?.[langIndex]?.trim();
    const descriptionEmpty = !description?.[langIndex]?.trim();
    return titleEmpty || subtitleEmpty || descriptionEmpty;
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
          </div>{" "}
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
                  Tour Title
                </h4>
                <FormField
                  control={form.control}
                  name="title.0"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.tourTitleEN")}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t("fields.tourTitleENPlaceholder")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-700">Subtitle</h4>
                <FormField
                  control={form.control}
                  name="subtitle.0"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.subtitleEN")}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t("fields.subtitleENPlaceholder")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-700">
                  Description
                </h4>
                <FormField
                  control={form.control}
                  name="description.0"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.descriptionEN")}</FormLabel>
                      <FormControl>
                        <MDXEditor
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder={t("fields.descriptionENPlaceholder")}
                          disabled={form.formState.isSubmitting}
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
                  Tour Title
                </h4>
                <FormField
                  control={form.control}
                  name="title.1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.tourTitleGE")}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t("fields.tourTitleGEPlaceholder")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-700">Subtitle</h4>
                <FormField
                  control={form.control}
                  name="subtitle.1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.subtitleGE")}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t("fields.subtitleGEPlaceholder")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-700">
                  Description
                </h4>
                <FormField
                  control={form.control}
                  name="description.1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.descriptionGE")}</FormLabel>
                      <FormControl>
                        <MDXEditor
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder={t("fields.descriptionGEPlaceholder")}
                          disabled={form.formState.isSubmitting}
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
                  Tour Title
                </h4>
                <FormField
                  control={form.control}
                  name="title.2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.tourTitleRU")}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t("fields.tourTitleRUPlaceholder")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-700">Subtitle</h4>
                <FormField
                  control={form.control}
                  name="subtitle.2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.subtitleRU")}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t("fields.subtitleRUPlaceholder")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-700">
                  Description
                </h4>
                <FormField
                  control={form.control}
                  name="description.2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.descriptionRU")}</FormLabel>
                      <FormControl>
                        <MDXEditor
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder={t("fields.descriptionRUPlaceholder")}
                          disabled={form.formState.isSubmitting}
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
        {/* 2. BUSINESS DETAILS */}
        <fieldset disabled={form.formState.isSubmitting} className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {t("sections.pricingDuration")}
            </h3>
            <p className="text-sm text-gray-500">
              {t("sections.pricingDurationDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="basePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.basePrice")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={0}
                      step={0.01}
                      placeholder={t("fields.basePricePlaceholder")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.duration")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={1}
                      placeholder={t("fields.durationPlaceholder")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </fieldset>
        {/* 3. SCHEDULE */}
        <fieldset disabled={form.formState.isSubmitting} className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {t("sections.schedule")}
            </h3>
            <p className="text-sm text-gray-500">
              {t("sections.scheduleDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="leaveTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.departureTime")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("fields.departureTimePlaceholder")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="returnTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.returnTime")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("fields.returnTimePlaceholder")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </fieldset>
        {/* 4. LOCATION */}
        <fieldset disabled={form.formState.isSubmitting} className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {t("sections.location")}
            </h3>
            <p className="text-sm text-gray-500">
              {t("sections.locationDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="coordinates.0"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>{t("fields.latitude")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="any"
                      value={value ?? 0}
                      onChange={(e) =>
                        onChange(e.target.value ? Number(e.target.value) : 0)
                      }
                      onPaste={(e) => handlePaste(e, true)}
                      placeholder={t("fields.latitudePlaceholder")}
                      title={t("help.coordinatesTitle")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coordinates.1"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>{t("fields.longitude")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="any"
                      value={value ?? 0}
                      onChange={(e) =>
                        onChange(e.target.value ? Number(e.target.value) : 0)
                      }
                      onPaste={(e) => handlePaste(e, false)}
                      placeholder={t("fields.longitudePlaceholder")}
                      title={t("help.coordinatesTitle")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Coordinates Info */}
          <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
            <div className="flex items-start">
              <div className="text-blue-500 mr-2">💡</div>
              <div className="text-sm text-blue-700">
                <strong>{t("help.coordinatesTip")}</strong>
                {t("help.coordinatesDesc")}
              </div>
            </div>
          </div>
        </fieldset>
        {/* 5. ADMINISTRATIVE */}
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
                <FormLabel>{t("fields.tourStatus")}</FormLabel>
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
                    {tourStatusEnum.options.map((status) => (
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
        {/* 6. VISUAL CONTENT */}
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
        </fieldset>{" "}
        {/* 7. SCHEDULES */}
        <fieldset disabled={form.formState.isSubmitting} className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {t("sections.schedules")}
            </h3>
            <p className="text-sm text-gray-500">
              {t("sections.schedulesDesc")}
            </p>
          </div>

          <FormField
            control={form.control}
            name="schedules"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <SchedulesManager
                    schedules={field.value || []}
                    onSchedulesChange={(schedules) => {
                      field.onChange(schedules);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>
        {/* 8. ACTIVITIES */}
        <fieldset disabled={form.formState.isSubmitting} className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {t("sections.activities")}
            </h3>
            <p className="text-sm text-gray-500">
              {t("sections.activitiesDesc")}
            </p>
          </div>
          <ActivityManager
            control={form.control}
            disabled={form.formState.isSubmitting}
          />{" "}
        </fieldset>
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
