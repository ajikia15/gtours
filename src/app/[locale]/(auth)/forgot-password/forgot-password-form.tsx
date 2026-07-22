"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/client";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

export default function ForgotPasswordForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const t = useTranslations("Auth");
  const tError = useTranslations("Errors");

  const resetPasswordSchema = useMemo(
    () =>
      z.object({
        email: z.string().email(tError("invalidEmail")),
      }),
    [tError]
  );

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    try {
      await sendPasswordResetEmail(auth, data.email);
      toast.success(t("passwordResetSent"));
      setIsSubmitted(true);
    } catch (e: any) {
      if (e.code === "auth/user-not-found") {
        toast.error(tError("noAccountFound"));
      } else if (e.code === "auth/too-many-requests") {
        toast.error(tError("tooManyRequests"));
      } else {
        toast.error(tError("sendResetFailed"));
      }
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center space-y-4">
        <div className="text-green-600 text-lg font-semibold">
          ✓ {t("emailSentTitle")}
        </div>
        <p className="text-gray-600">{t("emailSentBody")}</p>
        <p className="text-sm text-gray-500">{t("emailSentHelp")}</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="text-center mb-4">
          <p className="text-gray-600 text-sm">{t("forgotPasswordInstructions")}</p>
        </div>

        <FormField
          control={form.control}
          name="email"
          disabled={isSubmitting}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email")}</FormLabel>
              <FormControl>
                <Input type="email" placeholder={t("enterEmail")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          variant="brandred"
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? t("sending") : t("sendResetEmail")}
        </Button>
      </form>
    </Form>
  );
}
