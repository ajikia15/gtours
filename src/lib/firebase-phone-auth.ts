"use client";

import {
  RecaptchaVerifier,
  linkWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { auth } from "@/firebase/client";

let confirmationResult: ConfirmationResult | null = null;
let recaptchaVerifier: RecaptchaVerifier | null = null;

/**
 * Clean up existing reCAPTCHA verifier
 */
const cleanupExistingRecaptcha = () => {
  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear();
    } catch (error) {
      console.log("Error clearing reCAPTCHA:", error);
    }
    recaptchaVerifier = null;
  }

  // Remove reCAPTCHA containers
  const containers = document.querySelectorAll('[id*="recaptcha"]');
  containers.forEach((container) => container.remove());

  // Hide reCAPTCHA badge
  const badge = document.querySelector(".grecaptcha-badge") as HTMLElement;
  if (badge) {
    badge.style.display = "none";
  }
};

/**
 * Initialize invisible reCAPTCHA verifier
 */
const initializeRecaptcha = (): Promise<RecaptchaVerifier> => {
  return new Promise((resolve, reject) => {
    try {
      cleanupExistingRecaptcha();

      // Create invisible container
      const containerId = "recaptcha-" + Date.now();
      const div = document.createElement("div");
      div.id = containerId;
      div.style.cssText =
        "display: none !important; position: absolute; top: -9999px;";
      document.body.appendChild(div);

      recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: "invisible",
        callback: () => console.log("reCAPTCHA solved"),
        "expired-callback": () => cleanupExistingRecaptcha(),
      });

      // Hide badge after initialization
      setTimeout(() => {
        const badge = document.querySelector(
          ".grecaptcha-badge"
        ) as HTMLElement;
        if (badge) {
          badge.style.display = "none !important";
        }
        resolve(recaptchaVerifier!);
      }, 200);
    } catch (error) {
      console.error("Failed to initialize reCAPTCHA:", error);
      reject(error);
    }
  });
};

/**
 * Send SMS verification code and link phone to existing account
 */
export const sendFirebasePhoneVerification = async (
  phoneNumber: string
): Promise<{ success?: boolean; error?: boolean; message: string }> => {
  try {
    if (!auth.currentUser) {
      return {
        error: true,
        message: "You must be logged in to verify a phone number",
      };
    }

    // Validate Georgian phone number
    const formattedPhone = phoneNumber.startsWith("+995")
      ? phoneNumber
      : `+995${phoneNumber.replace(/^\+?995/, "")}`;

    if (!/^\+995[0-9]{9}$/.test(formattedPhone)) {
      return {
        error: true,
        message: "Please enter a valid Georgian phone number (+995XXXXXXXXX)",
      };
    }

    const recaptcha = await initializeRecaptcha();
    confirmationResult = await linkWithPhoneNumber(
      auth.currentUser,
      formattedPhone,
      recaptcha
    );

    return {
      success: true,
      message: "Verification code sent to " + formattedPhone,
    };
  } catch (error: any) {
    console.error("Error sending SMS:", error);

    const errorMessages: Record<string, string> = {
      "auth/too-many-requests":
        "Too many requests. Please wait a few minutes and try again.",
      "auth/invalid-phone-number": "Invalid phone number format",
      "auth/captcha-check-failed":
        "Verification failed. Please refresh and try again.",
      "auth/quota-exceeded": "SMS quota exceeded. Please try again later.",
      "auth/invalid-app-credential":
        "Firebase not configured properly. Check console setup.",
      "auth/provider-already-linked":
        "Phone number already linked to this account.",
      "auth/credential-already-in-use":
        "This phone number is already linked to another account.",
    };

    return {
      error: true,
      message:
        errorMessages[error.code] ||
        error.message ||
        "Failed to send verification code",
    };
  }
};

/**
 * Verify SMS code and complete phone number linking
 */
export const verifyFirebasePhoneCode = async (
  code: string
): Promise<{
  success?: boolean;
  error?: boolean;
  message: string;
  phoneNumber?: string;
}> => {
  try {
    if (!confirmationResult) {
      return {
        error: true,
        message: "No verification in progress. Please request a new code",
      };
    }

    const cleanCode = code.replace(/\D/g, "");
    if (cleanCode.length !== 6) {
      return {
        error: true,
        message: "Please enter a valid 6-digit verification code",
      };
    }

    const result = await confirmationResult.confirm(cleanCode);
    confirmationResult = null;

    return {
      success: true,
      message: "Phone number verified and linked to your account",
      phoneNumber: result.user.phoneNumber || undefined,
    };
  } catch (error: any) {
    console.error("Error verifying code:", error);

    const errorMessages: Record<string, string> = {
      "auth/invalid-verification-code":
        "Invalid verification code. Please check and try again.",
      "auth/code-expired": "Code expired. Please request a new one",
      "auth/too-many-requests": "Too many attempts. Please wait and try again.",
    };

    return {
      error: true,
      message:
        errorMessages[error.code] || error.message || "Verification failed",
    };
  }
};

/**
 * Clean up reCAPTCHA verifier
 */
export const cleanupRecaptcha = () => {
  cleanupExistingRecaptcha();
  confirmationResult = null;
};
