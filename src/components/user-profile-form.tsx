"use client";

import { useState } from "react";
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
  const [verificationState, setVerificationState] = useState<
    "none" | "sending" | "sent" | "verifying" | "verified"
  >("none");
  const [pendingPhoneNumber, setPendingPhoneNumber] = useState("");
  const [canResend, setCanResend] = useState(true);
  const [resendTimer, setResendTimer] = useState(0);

  // Create a unified schema that adapts based on mode
  const createSchema = () => {
    return z.object({
      firstName: z.string().min(2, "First name must be at least 2 characters"),
      lastName: z.string().min(2, "Last name must be at least 2 characters"),
      email:
        mode === "complete"
          ? z.string().email("Please enter a valid email address").optional()
          : z.string().optional(),
      phoneNumber:
        mode === "required"
          ? z
              .string()
              .min(9, "Please enter a 9-digit Georgian phone number")
              .refine(
                (val) => /^[0-9]{9}$/.test(val),
                "Please enter a 9-digit Georgian phone number"
              )
          : z
              .string()
              .optional()
              .refine(
                (val) => !val || /^[0-9]{9}$/.test(val),
                "Please enter a 9-digit Georgian phone number"
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

  // Get display title and description
  const displayTitle =
    title ||
    (mode === "required"
      ? "Complete Your Profile"
      : "Update Profile Information");
  const displayDescription =
    description ||
    (mode === "required"
      ? "Please provide the required information to continue"
      : undefined);

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
      toast.error("Please enter a valid 9-digit phone number");
      return;
    }

    setVerificationState("sending");
    const fullPhoneNumber = `+995${phoneNumber}`;

    try {
      // Create a container for reCAPTCHA if it doesn't exist
      let recaptchaContainer = document.getElementById("recaptcha-container");

      if (!recaptchaContainer) {
        recaptchaContainer = document.createElement("div");
        recaptchaContainer.id = "recaptcha-container";

        // Make it very visible with prominent styling
        recaptchaContainer.style.cssText = `
          margin: 20px 0;
          padding: 15px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background-color: #f8fafc;
          display: block;
          width: 100%;
          min-height: 80px;
          position: relative;
          z-index: 1000;
        `;

        // Add a clear label
        const label = document.createElement("div");
        label.textContent = "Please complete the reCAPTCHA verification:";
        label.style.cssText =
          "margin-bottom: 10px; font-weight: 500; color: #4b5563;";
        recaptchaContainer.appendChild(label);

        // Find a good place to insert it - right after the phone number field
        const phoneField = document.querySelector("[name='phoneNumber']");
        if (phoneField) {
          const formItem =
            phoneField.closest(".form-item") || phoneField.closest("div");
          if (formItem && formItem.parentNode) {
            formItem.parentNode.insertBefore(
              recaptchaContainer,
              formItem.nextSibling
            );
          } else {
            // Fallback - append to body
            document.body.appendChild(recaptchaContainer);
          }
        } else {
          // Fallback - append to body in a fixed position
          recaptchaContainer.style.position = "fixed";
          recaptchaContainer.style.left = "50%";
          recaptchaContainer.style.top = "50%";
          recaptchaContainer.style.transform = "translate(-50%, -50%)";
          recaptchaContainer.style.maxWidth = "400px";
          recaptchaContainer.style.boxShadow =
            "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
          document.body.appendChild(recaptchaContainer);
        }
      } else {
        // Make sure the container is visible
        recaptchaContainer.style.display = "block";
        recaptchaContainer.innerHTML =
          '<div style="margin-bottom: 10px; font-weight: 500; color: #4b5563;">Please complete the reCAPTCHA verification:</div>';
      }

      console.log("Sending verification code to:", fullPhoneNumber);
      const response = await sendFirebasePhoneVerification(fullPhoneNumber);

      if (response.error) {
        toast.error(response.message);
        setVerificationState("none");
        return;
      }

      toast.success("Code sent!");
      setPendingPhoneNumber(fullPhoneNumber);
      setVerificationState("sent");
      form.setValue("verificationCode", "");
      startResendTimer();
    } catch (error: any) {
      console.error("Error sending verification code:", error);
      toast.error(error.message || "Failed to send verification code");
      setVerificationState("none");

      // Try to clean up if there was an error
      cleanupRecaptcha();
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error("Please enter a 6-digit verification code");
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
      toast.success("Phone verified!");
      setVerificationState("verified");

      // Clean up after successful verification
      cleanupRecaptcha();
    } catch (error: any) {
      console.error("Error verifying code:", error);
      toast.error(error.message || "Failed to verify code");
      setVerificationState("sent");

      // If there was a major error, reset the verification process
      if (
        error.code === "auth/captcha-check-failed" ||
        error.message?.includes("captcha") ||
        error.code === "auth/missing-verification-code"
      ) {
        toast.error("Verification failed. Please request a new code.");
        resetVerification();
      }
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const token = await auth?.currentUser?.getIdToken();
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      if (phoneChanged && verificationState !== "verified") {
        toast.error("Please verify your phone number first");
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
        toast.error(response.message || "Failed to save profile");
        return;
      }

      toast.success("Profile saved successfully!");
      cleanupRecaptcha();

      // Call onComplete callback if provided
      if (onComplete) {
        onComplete();
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  // If profile is already complete in required mode, show success state
  if (isComplete) {
    const content = (
      <CardContent className="pt-6">
        <div className="flex items-center justify-center space-x-2 text-green-600">
          <CheckCircleIcon className="h-5 w-5" />
          <span className="font-medium">Profile Complete</span>
        </div>
        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <div>
            Name: {initialData?.firstName} {initialData?.lastName}
          </div>
          <div className="flex items-center gap-2">
            Phone: {initialData?.phoneNumber}
            <Badge variant="default" className="text-xs">
              <ShieldCheckIcon className="h-3 w-3 mr-1" />
              Verified
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
                      First Name {mode === "required" && "*"}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your first name" {...field} />
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
                      Last Name {mode === "required" && "*"}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your last name" {...field} />
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
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
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
                    Phone Number {mode === "required" && "*"}
                    {isPhoneVerified && (
                      <Badge variant="default" className="text-xs">
                        <ShieldCheckIcon className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    {verificationState === "verified" && (
                      <Badge variant="default" className="text-xs bg-green-600">
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs font-mono">
                      🇬🇪 Georgia
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
                          "Sending..."
                        ) : verificationState === "sent" && !canResend ? (
                          `${resendTimer}s`
                        ) : verificationState === "verified" ? (
                          <CheckCircleIcon className="h-4 w-4" />
                        ) : (
                          <>
                            <SendIcon className="h-4 w-4 mr-1" />
                            {verificationState === "sent"
                              ? "Resend"
                              : "Send Code"}
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
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter 6-digit code"
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
                          ? "Verifying..."
                          : "Verify"}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />

                  {/* Status Messages */}
                  {verificationState === "sent" && pendingPhoneNumber && (
                    <p className="text-xs text-blue-600">
                      Code sent to {pendingPhoneNumber}
                    </p>
                  )}
                  {phoneChanged && verificationState === "none" && (
                    <p className="text-xs text-amber-600">
                      Phone verification required
                    </p>
                  )}
                  {verificationState === "verified" && (
                    <p className="text-xs text-green-600">
                      Phone number verified ✓
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
                ? "Saving..."
                : mode === "required"
                ? "Save Required Information"
                : "Save Profile"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </>
  );

  return showCard ? <Card>{formContent}</Card> : <div>{formContent}</div>;
}
