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
import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import Image from "next/image";

// Define the TourFormData type directly from the schema
type TourFormData = z.infer<typeof tourSchema>;

// Mock activity types - this should come from your database
const ACTIVITY_TYPES = [
  {
    id: "camping",
    name: "Camping",
    pngFileName: "camping" as const,
  },
  {
    id: "hot-air-balloon",
    name: "Hot Air Balloon",
    pngFileName: "hot-air-balloon" as const,
  },
  {
    id: "parachute",
    name: "Parachute",
    pngFileName: "parachute" as const,
  },
  {
    id: "ski",
    name: "Skiing",
    pngFileName: "ski" as const,
  },
  {
    id: "water-rafting",
    name: "Water Rafting",
    pngFileName: "water-rafting" as const,
  },
  {
    id: "zip-lining",
    name: "Zip Lining",
    pngFileName: "zip-lining" as const,
  },
  {
    id: "snowmobile",
    name: "Snowmobile",
    pngFileName: "snowmobile" as const,
  },
  {
    id: "horse-rider",
    name: "Horse Riding",
    pngFileName: "horse-rider" as const,
  },
];

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
    lat: defaultValues?.lat || 0,
    long: defaultValues?.long || 0,
    status: defaultValues?.status || "draft",
    images: defaultValues?.images || [],
    offeredActivities: defaultValues?.offeredActivities || [],
  };
  const form = useForm<TourFormData>({
    resolver: zodResolver(tourSchema),
    defaultValues: combinedDefaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "offeredActivities",
  });

  const [selectedActivityType, setSelectedActivityType] = useState<string>("");

  const addActivity = () => {
    if (!selectedActivityType) return;

    const activityType = ACTIVITY_TYPES.find(
      (at) => at.id === selectedActivityType
    );
    if (!activityType) return;

    append({
      activityTypeId: selectedActivityType,
      nameSnapshot: activityType.name,
      priceIncrement: 0,
      latitude: 0,
      longitude: 0,
      specificDescription: "",
    });

    setSelectedActivityType("");
  };

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
              name="lat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="long"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
        <fieldset disabled={form.formState.isSubmitting} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Activities</h3>
            <div className="flex gap-2">
              <Select
                value={selectedActivityType}
                onValueChange={setSelectedActivityType}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select activity type" />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVITY_TYPES.map((activityType) => (
                    <SelectItem key={activityType.id} value={activityType.id}>
                      <div className="flex items-center gap-2">
                        <div className="relative w-4 h-4">
                          <Image
                            src={`/${activityType.pngFileName}.png`}
                            alt={activityType.name}
                            fill
                            style={{ objectFit: "contain" }}
                          />
                        </div>
                        {activityType.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                onClick={addActivity}
                disabled={!selectedActivityType}
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Activity
              </Button>
            </div>
          </div>

          {/* Activities List */}
          {fields.length > 0 && (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="border rounded-lg p-4 space-y-4 bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium flex items-center gap-2">
                      <div className="relative w-5 h-5">
                        <Image
                          src={`/${
                            ACTIVITY_TYPES.find(
                              (at) => at.id === field.activityTypeId
                            )?.pngFileName
                          }.png`}
                          alt={field.nameSnapshot}
                          fill
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                      {field.nameSnapshot}
                    </h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`offeredActivities.${index}.priceIncrement`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price Increment ($)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min={0}
                              step={0.01}
                              placeholder="0.00"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`offeredActivities.${index}.specificDescription`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specific Description</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Tour-specific details..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`offeredActivities.${index}.latitude`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Latitude</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              step="any"
                              placeholder="41.7151"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`offeredActivities.${index}.longitude`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Longitude</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              step="any"
                              placeholder="44.8271"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {fields.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No activities added yet. Select an activity type above to get
              started.
            </div>
          )}
        </fieldset>

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
