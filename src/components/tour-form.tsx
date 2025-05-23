"use client";

import { tourSchema, tourStatusEnum } from "@/validation/tourSchema";
import { useForm, useFieldArray } from "react-hook-form";
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
  const combinedDefaultValues: z.infer<typeof tourSchema> = {
    ...defaultValues,
    title: defaultValues?.title || "",
    descriptionEN: defaultValues?.descriptionEN || "",
    descriptionGE: defaultValues?.descriptionGE || "",
    descriptionRU: defaultValues?.descriptionRU || "",
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Main Info Fieldsets */}
        <fieldset
          disabled={form.formState.isSubmitting}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Left Column */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Tour Duration (days)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min={1} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="leaveTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave Time (HH:MM)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="09:00" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="basePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Price</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min={0} step={0.01} />
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
                  <FormLabel>Return Time (HH:MM)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="17:00" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coordinates.0"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Latitude</FormLabel>
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
                      placeholder="41.715138"
                      title="Paste Google Maps coordinates (e.g., '41.715138, 44.827096') into either field"
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
                  <FormLabel>Longitude</FormLabel>
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
                      placeholder="44.827096"
                      title="Paste Google Maps coordinates (e.g., '41.715138, 44.827096') into either field"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Coordinates Info */}
            <div className="col-span-2 text-xs text-gray-500 mt-1">
              💡 Tip: You can paste Google Maps coordinates (e.g., "41.715138,
              44.827096") directly into either field and both will be
              automatically filled.
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
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
          </div>
        </fieldset>

        {/* Description Fieldset */}
        <fieldset disabled={form.formState.isSubmitting} className="space-y-4">
          <FormField
            control={form.control}
            name="descriptionEN"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (English)</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="descriptionGE"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Georgian)</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="descriptionRU"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Russian)</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

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

        {/* Activities Management Section */}
        <ActivityManager
          control={form.control}
          disabled={form.formState.isSubmitting}
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full"
          variant="brandred"
        >
          {submitButtonLabel}
        </Button>
      </form>
    </Form>
  );
}
