"use client";

import { activityTypeSchema } from "@/validation/activityTypeSchema";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import Image from "next/image";

// Available PNG files (sync with schema)
const ALLOWED_PNG_FILES = [
  "camping",
  "hot-air-balloon",
  "parachute",
  "ski",
  "water-rafting",
  "zip-lining",
  "snowmobile",
  "horse-rider",
] as const;

type ActivityTypeFormData = z.infer<typeof activityTypeSchema>;

type Props = {
  handleSubmit: (data: ActivityTypeFormData) => void;
  submitButtonLabel: React.ReactNode;
  defaultValues?: Partial<ActivityTypeFormData>;
  isSubmitting?: boolean;
  isEdit?: boolean;
};

export default function ActivityTypeForm({
  handleSubmit: onSubmit,
  submitButtonLabel,
  defaultValues,
  isSubmitting = false,
  isEdit = false,
}: Props) {
  const t = useTranslations("ActivityTypeForm");
  const form = useForm<ActivityTypeFormData>({
    resolver: zodResolver(activityTypeSchema),
    defaultValues: {
      id: defaultValues?.id || "",
      name: defaultValues?.name || "",
      pngFileName: defaultValues?.pngFileName || undefined,
      genericDescription: defaultValues?.genericDescription || "",
      isActive: defaultValues?.isActive ?? true,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <fieldset disabled={isSubmitting} className="space-y-4">
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Activity ID (used for translations)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="camping, hot-air-balloon, ski, etc."
                    disabled={isEdit} // Don't allow editing ID
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Camping, Hot Air Balloon, etc."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pngFileName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PNG Icon</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a PNG icon" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ALLOWED_PNG_FILES.map((png) => (
                      <SelectItem key={png} value={png}>
                        <div className="flex items-center gap-2">
                          <div className="relative w-4 h-4">
                            <Image
                              src={`/${png}.png`}
                              alt={png}
                              fill
                              style={{ objectFit: "contain" }}
                            />
                          </div>
                          {png}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="genericDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Generic Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="General description of this activity type..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Active Status</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Whether this activity type is available for selection
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </fieldset>

        <Button type="submit" disabled={isSubmitting}>
          {submitButtonLabel}
        </Button>
      </form>
    </Form>
  );
}
