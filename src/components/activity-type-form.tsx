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

type ActivityTypeFormData = z.infer<typeof activityTypeSchema>;

type Props = {
  handleSubmit: (data: ActivityTypeFormData) => void;
  submitButtonLabel: React.ReactNode;
  defaultValues?: ActivityTypeFormData;
  isSubmitting?: boolean;
};

export default function ActivityTypeForm({
  handleSubmit: onSubmit,
  submitButtonLabel,
  defaultValues,
  isSubmitting = false,
}: Props) {
  const t = useTranslations("ActivityTypeForm");
  const form = useForm<ActivityTypeFormData>({
    resolver: zodResolver(activityTypeSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      genericDescription: defaultValues?.genericDescription || "",
      icon: defaultValues?.icon || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <fieldset disabled={isSubmitting} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("nameLabel")}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={t("namePlaceholder")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="genericDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("descriptionLabel")}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={t("descriptionPlaceholder")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("iconLabel")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t("iconPlaceholder")}
                    type="url"
                  />
                </FormControl>
                <FormMessage />
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
