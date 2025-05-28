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
      console.log("Clearing reCAPTCHA verifier");
      recaptchaVerifier.clear();
    } catch (error) {
      console.log("Error clearing reCAPTCHA:", error);
    }
    recaptchaVerifier = null;
  }

  // Empty the main container instead of removing it
  const mainContainer = document.getElementById("recaptcha-container");
  if (mainContainer) {
    console.log("Emptying main reCAPTCHA container");
    mainContainer.innerHTML = "";
  }

  // Remove any additional reCAPTCHA containers (but not the main one)
  console.log("Removing additional reCAPTCHA containers");
  const containers = document.querySelectorAll(
    '[id^="recaptcha"]:not(#recaptcha-container)'
  );
  containers.forEach((container) => {
    console.log("Removing container:", container.id);
    container.remove();
  });

  // Remove all reCAPTCHA iframes
  const iframes = document.querySelectorAll('iframe[src*="recaptcha"]');
  iframes.forEach((iframe) => {
    console.log("Removing reCAPTCHA iframe");
    iframe.remove();
  });

  // Hide reCAPTCHA badge if it exists
  const badges = document.querySelectorAll(".grecaptcha-badge");
  badges.forEach((badge) => {
    const badgeElement = badge as HTMLElement;
    console.log("Hiding reCAPTCHA badge");
    badgeElement.style.display = "none";
  });

  // Reset global variables
  confirmationResult = null;
};

/**
 * Initialize visible reCAPTCHA verifier
 */
const initializeRecaptcha = (): Promise<RecaptchaVerifier> => {
  return new Promise((resolve, reject) => {
    try {
      cleanupExistingRecaptcha();

      // Use a consistent container ID that matches what's in the components
      const containerId = "recaptcha-container";
      const container = document.getElementById(containerId);

      if (!container) {
        console.error("reCAPTCHA container not found");
        reject(
          new Error("reCAPTCHA container not found. Please refresh the page.")
        );
        return;
      }

      console.log("Found reCAPTCHA container:", container);

      // Ensure container is visible
      container.style.display = "block";
      container.style.minHeight = "100px";
      container.style.width = "100%";
      container.style.position = "relative";
      container.style.zIndex = "1000";

      // Use normal size recaptcha
      recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: "normal",
        callback: () => {
          console.log("reCAPTCHA solved successfully");
          // Add visual feedback when solved
          const successMessage = document.createElement("div");
          successMessage.textContent = "✓ reCAPTCHA verification complete";
          successMessage.style.cssText =
            "color: #10b981; font-weight: 500; margin-top: 8px;";
          container.appendChild(successMessage);
        },
        "expired-callback": () => {
          console.log("reCAPTCHA expired");
          cleanupExistingRecaptcha();
          reject(
            new Error("reCAPTCHA verification expired. Please try again.")
          );
        },
      });

      // Render the reCAPTCHA explicitly
      console.log("Attempting to render reCAPTCHA...");
      recaptchaVerifier
        .render()
        .then(() => {
          console.log("reCAPTCHA rendered successfully");

          // Additional check to make sure it's visible
          setTimeout(() => {
            const iframe = container.querySelector("iframe");
            if (iframe) {
              console.log("reCAPTCHA iframe found");
              iframe.style.display = "block";
              iframe.style.margin = "0 auto";
            } else {
              console.warn("No reCAPTCHA iframe found after rendering");
            }
          }, 200);

          resolve(recaptchaVerifier!);
        })
        .catch((error) => {
          console.error("Failed to render reCAPTCHA:", error);
          // Try with explicit container reference
          try {
            recaptchaVerifier = new RecaptchaVerifier(auth, container, {
              size: "normal",
              callback: () =>
                console.log("reCAPTCHA solved successfully (fallback)"),
              "expired-callback": () =>
                console.log("reCAPTCHA expired (fallback)"),
            });
            recaptchaVerifier
              .render()
              .then(() => {
                console.log("reCAPTCHA rendered successfully (fallback)");
                resolve(recaptchaVerifier!);
              })
              .catch(reject);
          } catch (fallbackError) {
            console.error("Fallback reCAPTCHA also failed:", fallbackError);
            reject(error);
          }
        });
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

    console.log("Initializing reCAPTCHA for phone verification...");
    const recaptcha = await initializeRecaptcha();
    console.log("reCAPTCHA initialized successfully");

    console.log("Sending verification code to:", formattedPhone);
    confirmationResult = await linkWithPhoneNumber(
      auth.currentUser,
      formattedPhone,
      recaptcha
    );
    console.log("Verification code sent successfully");

    return {
      success: true,
      message: "Verification code sent to " + formattedPhone,
    };
  } catch (error: any) {
    console.error("Error sending SMS:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);

    // Special handling for captcha errors
    if (
      error.code === "auth/captcha-check-failed" ||
      error.code === "auth/missing-recaptcha-token" ||
      error.message?.includes("captcha")
    ) {
      cleanupExistingRecaptcha();
      return {
        error: true,
        message:
          "reCAPTCHA verification failed. Please refresh the page and try again.",
      };
    }

    // Handle other common errors
    const errorMessages: Record<string, string> = {
      "auth/too-many-requests":
        "Too many requests. Please wait a few minutes and try again.",
      "auth/invalid-phone-number": "Invalid phone number format",
      "auth/captcha-check-failed":
        "reCAPTCHA verification failed. Please refresh and try again.",
      "auth/missing-recaptcha-token":
        "reCAPTCHA token is missing. Please complete the reCAPTCHA challenge.",
      "auth/quota-exceeded": "SMS quota exceeded. Please try again later.",
      "auth/invalid-app-credential":
        "Firebase not configured properly. Check console setup.",
      "auth/provider-already-linked":
        "Phone number already linked to this account.",
      "auth/credential-already-in-use":
        "This phone number is already linked to another account.",
      "auth/argument-error":
        "Invalid arguments provided. Please check your input and try again.",
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
    console.log("Starting code verification process");

    if (!confirmationResult) {
      console.error("No confirmation result available");
      return {
        error: true,
        message: "No verification in progress. Please request a new code",
      };
    }

    const cleanCode = code.replace(/\D/g, "");
    console.log("Verifying code length:", cleanCode.length);

    if (cleanCode.length !== 6) {
      return {
        error: true,
        message: "Please enter a valid 6-digit verification code",
      };
    }

    console.log("Confirming verification code");
    const result = await confirmationResult.confirm(cleanCode);
    console.log("Code confirmed successfully");

    // Reset confirmation result after successful verification
    confirmationResult = null;

    // Clean up reCAPTCHA after verification
    cleanupExistingRecaptcha();

    return {
      success: true,
      message: "Phone number verified and linked to your account",
      phoneNumber: result.user.phoneNumber || undefined,
    };
  } catch (error: any) {
    console.error("Error verifying code:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);

    const errorMessages: Record<string, string> = {
      "auth/invalid-verification-code":
        "Invalid verification code. Please check and try again.",
      "auth/code-expired": "Code expired. Please request a new one",
      "auth/too-many-requests": "Too many attempts. Please wait and try again.",
      "auth/missing-verification-code": "Please enter a verification code",
      "auth/captcha-check-failed":
        "reCAPTCHA verification failed. Please try again.",
    };

    return {
      error: true,
      message:
        errorMessages[error.code] || error.message || "Verification failed",
    };
  }
};

/**
 * Clean up reCAPTCHA verifier and reset state
 * This function should be called when the component unmounts or when verification is complete
 */
export const cleanupRecaptcha = () => {
  console.log("Cleanup function called");
  cleanupExistingRecaptcha();
  confirmationResult = null;

  // Add a delay to ensure everything is cleaned up
  setTimeout(() => {
    console.log("Performing additional cleanup checks");
    // Double-check for any remaining reCAPTCHA elements
    const remainingElements = document.querySelectorAll(
      '[id^="recaptcha"], iframe[src*="recaptcha"], .grecaptcha-badge'
    );
    if (remainingElements.length > 0) {
      console.log(
        `Found ${remainingElements.length} remaining reCAPTCHA elements, cleaning up...`
      );
      remainingElements.forEach((el) => el.remove());
    }
  }, 500);
};
