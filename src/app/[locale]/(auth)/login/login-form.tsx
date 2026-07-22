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
import ContinueWithGoogleButton from "@/components/continue-with-google-button";
import { loginUserSchema } from "@/validation/loginUser";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/context/auth";
import { useTranslations } from "next-intl";

export default function LoginForm() {
  const auth = useAuth();
  const t = useTranslations("Auth");
  const tError = useTranslations("Errors");

  const form = useForm<z.infer<typeof loginUserSchema>>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: z.infer<typeof loginUserSchema>) => {
    try {
      await auth?.loginWithEmail(data.email, data.password);

      toast.success(t("loggedInSuccessfully"));

      window.location.href = "/";
    } catch (e: any) {
      if (e.code === "auth/invalid-credential") {
        toast.error(tError("invalidCredentials"));
      } else {
        toast.error(e.message);
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

        <FormField
          control={form.control}
          name="password"
          disabled={isSubmitting}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>{t("password")}</FormLabel>
                <Link
                  href="/forgot-password"
                  className="text-sm text-gray-600 underline"
                >
                  {t("forgotPasswordQuestion")}
                </Link>
              </div>
              <FormControl>
                <Input
                  type="password"
                  placeholder={t("enterPassword")}
                  {...field}
                />
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
          {isSubmitting ? t("loggingIn") : t("login")}
        </Button>
        <div className="text-center">{t("or")}</div>
      </form>
      <ContinueWithGoogleButton />
    </Form>
  );
}
