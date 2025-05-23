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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* 1. BASIC INFORMATION */}
        <fieldset disabled={form.formState.isSubmitting} className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Basic Information
            </h3>
            <p className="text-sm text-gray-500">
              Essential details about your tour
            </p>
          </div>

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tour Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Amazing Georgia Adventure" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="descriptionEN"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (English)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={3}
                      placeholder="Describe your tour in English..."
                    />
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
                    <Textarea
                      {...field}
                      rows={3}
                      placeholder="ჩაწერეთ ტურის აღწერა ქართულად..."
                    />
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
                    <Textarea
                      {...field}
                      rows={3}
                      placeholder="Опишите ваш тур на русском..."
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
              Pricing & Duration
            </h3>
            <p className="text-sm text-gray-500">
              Business details and tour length
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="basePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Price (GEL)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={0}
                      step={0.01}
                      placeholder="150.00"
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
                  <FormLabel>Duration (days)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min={1} placeholder="3" />
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
            <h3 className="text-lg font-medium text-gray-900">Schedule</h3>
            <p className="text-sm text-gray-500">Tour timing details</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="leaveTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departure Time</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="09:00" />
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
                  <FormLabel>Return Time</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="17:00" />
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
            <h3 className="text-lg font-medium text-gray-900">Location</h3>
            <p className="text-sm text-gray-500">Main tour area coordinates</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          {/* Coordinates Info */}
          <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
            <div className="flex items-start">
              <div className="text-blue-500 mr-2">💡</div>
              <div className="text-sm text-blue-700">
                <strong>Tip:</strong> You can paste Google Maps coordinates
                (e.g., "41.715138, 44.827096") directly into either field and
                both will be automatically filled.
              </div>
            </div>
          </div>
        </fieldset>

        {/* 5. ADMINISTRATIVE */}
        <fieldset disabled={form.formState.isSubmitting} className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium text-gray-900">Status</h3>
            <p className="text-sm text-gray-500">Publication status</p>
          </div>

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="max-w-xs">
                <FormLabel>Tour Status</FormLabel>
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
        </fieldset>

        {/* 6. VISUAL CONTENT */}
        <fieldset disabled={form.formState.isSubmitting} className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium text-gray-900">Images</h3>
            <p className="text-sm text-gray-500">
              Visual content for your tour
            </p>
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
            <h3 className="text-lg font-medium text-gray-900">Activities</h3>
            <p className="text-sm text-gray-500">
              Specific activities included in this tour
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
