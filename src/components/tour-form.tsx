"use client";

import { tourSchema, tourStatusEnum } from "@/validation/tourSchema";
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
import ActivityManager from "./activity-manager";
import { useCoordinatePaste } from "@/lib/useCoordinatePaste";
import { useTranslations } from "next-intl";

// Define the TourFormData type directly from the schema
type TourFormData = z.infer<typeof tourSchema>;

type Props = {
  handleSubmit: (data: TourFormData) => void;
  submitButtonLabel: React.ReactNode;
  defaultValues?: TourFormData;
};

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
          </div>          {/* Title Fields */}
          <div className="space-y-4">
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

          {/* Subtitle Fields */}
          <div className="space-y-4">
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
            />
          </div>
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
                <strong>{t("help.coordinatesTip")}</strong>{" "}
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
        </fieldset>

        {/* 7. ACTIVITIES */}
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
          />
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
