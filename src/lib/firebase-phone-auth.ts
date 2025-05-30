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
 * Simple cleanup function
 */
export const cleanupRecaptcha = () => {
  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear();
    } catch (error) {
      console.log("Error clearing reCAPTCHA:", error);
    }
    recaptchaVerifier = null;
  }
  confirmationResult = null;
};

/**
 * Initialize basic reCAPTCHA (not Enterprise)
 */
const initializeRecaptcha = async (): Promise<RecaptchaVerifier> => {
  cleanupRecaptcha();

  // Ensure container exists
  let container = document.getElementById("recaptcha-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "recaptcha-container";
    document.body.appendChild(container);
  }

  // Create the most basic reCAPTCHA verifier
  recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
    size: "invisible",
    callback: () => console.log("reCAPTCHA solved"),
  });

  await recaptchaVerifier.render();
  return recaptchaVerifier;
};

/**
 * Send verification code to phone number
 */
export const sendFirebasePhoneVerification = async (
  phoneNumber: string
): Promise<{ success?: boolean; error?: boolean; message: string }> => {
  try {
    if (!auth.currentUser) {
      return { error: true, message: "You must be logged in" };
    }

    // Format Georgian phone number
    const cleanNumber = phoneNumber.replace(/\D/g, "");
    const formattedPhone = `+995${cleanNumber}`;

    if (!/^\+995[0-9]{9}$/.test(formattedPhone)) {
      return { error: true, message: "Invalid Georgian phone number" };
    }

    console.log("Sending code to:", formattedPhone);

    const recaptcha = await initializeRecaptcha();
    confirmationResult = await linkWithPhoneNumber(
      auth.currentUser,
      formattedPhone,
      recaptcha
    );

    return { success: true, message: `Code sent to ${formattedPhone}` };
  } catch (error: any) {
    console.error("Phone auth error:", error);
    cleanupRecaptcha();

    // Handle common errors
    if (error.code === "auth/invalid-app-credential") {
      return {
        error: true,
        message:
          "Phone authentication not enabled in Firebase Console. Please enable it in Authentication → Sign-in method.",
      };
    }

    if (error.code === "auth/provider-already-linked") {
      return {
        error: true,
        message: "Phone number already linked to your account",
      };
    }

    if (error.code === "auth/credential-already-in-use") {
      return {
        error: true,
        message: "Phone number already linked to another account",
      };
    }

    return { error: true, message: error.message || "Failed to send code" };
  }
};

/**
 * Verify the SMS code
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
      return { error: true, message: "No verification in progress" };
    }

    const cleanCode = code.replace(/\D/g, "");
    if (cleanCode.length !== 6) {
      return { error: true, message: "Enter a 6-digit code" };
    }

    const result = await confirmationResult.confirm(cleanCode);
    cleanupRecaptcha();

    return {
      success: true,
      message: "Phone number linked successfully!",
      phoneNumber: result.user.phoneNumber || undefined,
    };
  } catch (error: any) {
    console.error("Verification error:", error);

    if (error.code === "auth/invalid-verification-code") {
      return { error: true, message: "Invalid verification code" };
    }

    if (error.code === "auth/code-expired") {
      return { error: true, message: "Code expired. Request a new one" };
    }

    return { error: true, message: error.message || "Verification failed" };
  }
};
