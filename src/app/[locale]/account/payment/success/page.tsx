/**
 * Payment Success Page
 *
 * Displays when user returns from successful BOG payment
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth";

interface PaymentStatus {
  orderId?: string;
  status?: string;
  loading: boolean;
  error?: string;
}

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { auth } = useAuth();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
    loading: true,
  });

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const orderId = searchParams.get("order_id");
        if (!orderId) {
          setPaymentStatus({
            loading: false,
            error: "No order ID provided",
          });
          return;
        }

        if (!auth?.currentUser) {
          setPaymentStatus({
            loading: false,
            error: "Please sign in to view payment status",
          });
          return;
        }

        // Get auth token
        const token = await auth.currentUser.getIdToken();

        // Check payment status
        const response = await fetch(`/api/bog/status/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to check payment status");
        }

        const data = await response.json();

        setPaymentStatus({
          orderId,
          status: data.order?.status,
          loading: false,
        });

        // If payment is confirmed, redirect to account page after delay
        if (data.order?.status === "completed") {
          setTimeout(() => {
            router.push("/account?tab=orders");
          }, 5000);
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
        setPaymentStatus({
          loading: false,
          error: "Failed to check payment status",
        });
      }
    };

    checkPaymentStatus();
  }, [auth, searchParams, router]);

  if (paymentStatus.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying payment status...</p>
        </div>
      </div>
    );
  }

  if (paymentStatus.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Payment Status Error
          </h1>
          <p className="text-gray-600 mb-4">{paymentStatus.error}</p>
          <button
            onClick={() => router.push("/account")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-4">
          Your payment has been processed successfully. You will receive a
          confirmation email shortly.
        </p>

        {paymentStatus.orderId && (
          <p className="text-sm text-gray-500 mb-4">
            Order ID: {paymentStatus.orderId}
          </p>
        )}

        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Redirecting to your account in 5 seconds...
          </p>
          <button
            onClick={() => router.push("/account?tab=orders")}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            View My Orders
          </button>
        </div>
      </div>
    </div>
  );
}
