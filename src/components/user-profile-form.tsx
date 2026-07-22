"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PhoneIcon,
  ShieldCheckIcon,
  SendIcon,
  CheckCircleIcon,
  UserIcon,
} from "lucide-react";
import { UserProfile } from "@/types/User";
import { saveUserProfile } from "@/data/userProfile";
import { useAuth } from "@/context/auth";
import {
  sendFirebasePhoneVerification,
  verifyFirebasePhoneCode,
  cleanupRecaptcha,
} from "@/lib/firebase-phone-auth";

interface UserProfileFormProps {
  initialData?: UserProfile | null;
  mode?: "required" | "complete";
  onComplete?: () => void;
  showTitle?: boolean;
  title?: string;
  description?: string;
  showCard?: boolean;
}

export default function UserProfileForm({
  initialData,
  mode = "complete",
  onComplete,
  showTitle = true,
  title,
  description,
  showCard = true,
}: UserProfileFormProps) {
  const auth = useAuth();
  const t = useTranslations("Profile");
  const tErrors = useTranslations("Errors");
  const [verificationState, setVerificationState] = useState<
    "none" | "sending" | "sent" | "verifying" | "verified"
  >("none");
  const [pendingPhoneNumber, setPendingPhoneNumber] = useState("");
  const [canResend, setCanResend] = useState(true);
  const [resendTimer, setResendTimer] = useState(0);

  const createSchema = () => {
    return z.object({
      firstName: z.string().min(2, t("firstNameMin")),
      lastName: z.string().min(2, t("lastNameMin")),
      email:
        mode === "complete"
          ? z.string().email(tErrors("invalidEmail")).optional()
          : z.string().optional(),
      phoneNumber:
        mode === "required"
          ? z
              .string()
              .min(9, t("phoneNumberInvalid"))
              .refine(
                (val) => /^[0-9]{9}$/.test(val),
                t("phoneNumberInvalid")
              )
          : z
              .string()
              .optional()
              .refine(
                (val) => !val || /^[0-9]{9}$/.test(val),
                t("phoneNumberInvalid")
              ),
      verificationCode: z.string().optional(),
    });
  };

  const profileSchema = createSchema();
  type FormData = z.infer<typeof profileSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      email: initialData?.email || auth?.currentUser?.email || "",
      phoneNumber: initialData?.phoneNumber?.replace("+995", "") || "",
      verificationCode: "",
    },
  });

  const { isSubmitting } = form.formState;
  const phoneNumber = useWatch({ control: form.control, name: "phoneNumber" });
  const verificationCode = useWatch({
    control: form.control,
    name: "verificationCode",
  });

  const phoneChanged = !!(
    phoneNumber && `+995${phoneNumber}` !== initialData?.phoneNumber
  );
  const isPhoneVerified = initialData?.phoneVerified && !phoneChanged;

  // Check if profile is complete (for required mode only)
  const isComplete =
    mode === "required" &&
    !!(
      initialData?.firstName &&
      initialData?.lastName &&
      initialData?.phoneNumber &&
      initialData?.phoneVerified &&
      !phoneChanged
    );

  const displayTitle =
    title ||
    (mode === "required"
      ? t("completeYourProfile")
      : t("updateProfileInformation"));
  const displayDescription =
    description ||
    (mode === "required" ? t("provideRequiredInfo") : undefined);

  const startResendTimer = () => {
    setCanResend(false);
    setResendTimer(60);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetVerification = () => {
    setVerificationState("none");
    setPendingPhoneNumber("");
    form.setValue("verificationCode", "");
    cleanupRecaptcha();
  };

  const handleSendCode = async () => {
    if (!phoneNumber || phoneNumber.length !== 9) {
      toast.error(t("invalidPhoneNumber"));
      return;
    }

    setVerificationState("sending");

    try {
      console.log("Sending verification code...");
      const response = await sendFirebasePhoneVerification(phoneNumber);

      if (response.error) {
        toast.error(response.message);
        setVerificationState("none");
        return;
      }

      toast.success(t("codeSent"));
      setPendingPhoneNumber(`+995${phoneNumber}`);
      setVerificationState("sent");
      form.setValue("verificationCode", "");
      startResendTimer();
    } catch (error: any) {
      console.error("Error sending verification code:", error);
      toast.error(error.message || t("sendCodeFailed"));
      setVerificationState("none");
      cleanupRecaptcha();
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error(t("invalidVerificationCode"));
      return;
    }

    setVerificationState("verifying");

    try {
      console.log("Verifying code:", verificationCode);
      const response = await verifyFirebasePhoneCode(verificationCode);

      if (response.error) {
        console.error("Verification error:", response.message);
        toast.error(response.message);
        setVerificationState("sent");
        return;
      }

      console.log("Verification successful");
      toast.success(t("phoneVerified"));
      setVerificationState("verified");

      // Clean up after successful verification
      cleanupRecaptcha();
    } catch (error: any) {
      console.error("Error verifying code:", error);
      toast.error(error.message || t("verifyCodeFailed"));
      setVerificationState("sent");

      // If there was a major error, reset the verification process
      if (
        error.code === "auth/captcha-check-failed" ||
        error.message?.includes("captcha") ||
        error.code === "auth/missing-verification-code"
      ) {
        toast.error(t("verificationFailedRetry"));
        resetVerification();
      }
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const token = await auth?.currentUser?.getIdToken();
      if (!token) {
        toast.error(t("authRequired"));
        return;
      }

      if (phoneChanged && verificationState !== "verified") {
        toast.error(t("verifyPhoneFirst"));
        return;
      }

      const profileData: any = {
        firstName: data.firstName,
        lastName: data.lastName,
      };

      // Add email only if it exists and we're in complete mode
      if (mode === "complete" && data.email) {
        profileData.email = data.email;
      }

      if (data.phoneNumber) {
        profileData.phoneNumber = `+995${data.phoneNumber}`;
        profileData.phoneVerified =
          verificationState === "verified" ||
          (!phoneChanged && initialData?.phoneVerified);
      }

      const response = await saveUserProfile(profileData, token);

      if (response.error) {
        toast.error(response.message || tErrors("saveFailed"));
        return;
      }

      toast.success(t("profileSaved"));
      cleanupRecaptcha();

      // Call onComplete callback if provided
      if (onComplete) {
        onComplete();
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(tErrors("updateFailed"));
    }
  };

  // If profile is already complete in required mode, show success state
  if (isComplete) {
    const content = (
      <CardContent className="pt-6">
        <div className="flex items-center justify-center space-x-2 text-green-600">
          <CheckCircleIcon className="h-5 w-5" />
          <span className="font-medium">{t("profileComplete")}</span>
        </div>
        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <div>
            {t("nameLabel")} {initialData?.firstName} {initialData?.lastName}
          </div>
          <div className="flex items-center gap-2">
            {t("phoneLabel")} {initialData?.phoneNumber}
            <Badge variant="default" className="text-xs">
              <ShieldCheckIcon className="h-3 w-3 mr-1" />
              {t("verified")}
            </Badge>
          </div>
        </div>
      </CardContent>
    );

    return showCard ? <Card>{content}</Card> : content;
  }

  const formContent = (
    <>
      {showTitle && showCard && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            {displayTitle}
          </CardTitle>
          {displayDescription && (
            <p className="text-sm text-muted-foreground">
              {displayDescription}
            </p>
          )}
        </CardHeader>
      )}
      <CardContent className={showCard ? undefined : "p-0"}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("firstName")} {mode === "required" && "*"}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder={t("firstNamePlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("lastName")} {mode === "required" && "*"}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder={t("lastNamePlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Email Field - Only in complete mode */}
            {mode === "complete" && (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("emailAddress")}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t("emailPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <PhoneIcon className="h-4 w-4" />
                    {t("phoneNumberLabel")} {mode === "required" && "*"}
                    {isPhoneVerified && (
                      <Badge variant="default" className="text-xs">
                        <ShieldCheckIcon className="h-3 w-3 mr-1" />
                        {t("verified")}
                      </Badge>
                    )}
                    {verificationState === "verified" && (
                      <Badge variant="default" className="text-xs bg-green-600">
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        {t("verified")}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs font-mono">
                      🇬🇪 {t("georgia")}
                    </Badge>
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <div className="flex items-center bg-gray-50 border border-r-0 rounded-l-md px-3 py-2 text-sm font-mono">
                        +995
                      </div>
                      <Input
                        placeholder="555123456"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (value.length <= 9) {
                            field.onChange(value);
                            if (value !== phoneNumber) {
                              resetVerification();
                            }
                          }
                        }}
                        className="rounded-none font-mono"
                        maxLength={9}
                      />
                      <Button
                        type="button"
                        variant={
                          verificationState === "verified"
                            ? "outline"
                            : "default"
                        }
                        onClick={handleSendCode}
                        disabled={
                          !phoneNumber ||
                          (phoneNumber as string)?.length !== 9 ||
                          verificationState === "sending" ||
                          (verificationState === "sent" && !canResend) ||
                          verificationState === "verified"
                        }
                        className="rounded-l-none min-w-[100px]"
                      >
                        {verificationState === "sending" ? (
                          t("sending")
                        ) : verificationState === "sent" && !canResend ? (
                          `${resendTimer}s`
                        ) : verificationState === "verified" ? (
                          <CheckCircleIcon className="h-4 w-4" />
                        ) : (
                          <>
                            <SendIcon className="h-4 w-4 mr-1" />
                            {verificationState === "sent"
                              ? t("resend")
                              : t("sendCode")}
                          </>
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Verification Code */}
            <FormField
              control={form.control}
              name="verificationCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("verificationCodeLabel")}</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        placeholder={t("codePlaceholder")}
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (value.length <= 6) {
                            field.onChange(value);
                          }
                        }}
                        className="text-center font-mono tracking-wider"
                        maxLength={6}
                        disabled={
                          verificationState === "none" ||
                          verificationState === "verified"
                        }
                      />
                      <Button
                        type="button"
                        onClick={handleVerifyCode}
                        disabled={
                          verificationState === "none" ||
                          verificationState === "verified" ||
                          !verificationCode ||
                          (verificationCode as string)?.length !== 6 ||
                          verificationState === "verifying"
                        }
                      >
                        {verificationState === "verifying"
                          ? t("verifying")
                          : t("verify")}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />

                  {/* Status Messages */}
                  {verificationState === "sent" && pendingPhoneNumber && (
                    <p className="text-xs text-blue-600">
                      {t("codeSentTo", { phone: pendingPhoneNumber })}
                    </p>
                  )}
                  {phoneChanged && verificationState === "none" && (
                    <p className="text-xs text-amber-600">
                      {t("phoneVerificationRequired")}
                    </p>
                  )}
                  {verificationState === "verified" && (
                    <p className="text-xs text-green-600">
                      {t("phoneNumberVerified")} ✓
                    </p>
                  )}
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={
                isSubmitting ||
                (phoneChanged && verificationState !== "verified")
              }
            >
              {isSubmitting
                ? t("saving")
                : mode === "required"
                ? t("saveRequiredInformation")
                : t("saveProfile")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </>
  );

  return showCard ? <Card>{formContent}</Card> : <div>{formContent}</div>;
}
