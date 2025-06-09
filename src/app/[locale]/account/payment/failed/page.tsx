/**
 * Payment Failed Page
 *
 * Displays when user returns from failed BOG payment
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

export default function PaymentFailedPage() {
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking payment status...</p>
        </div>
      </div>
    );
  }

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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Failed
        </h1>
        <p className="text-gray-600 mb-4">
          Unfortunately, your payment could not be processed. Your items are
          still in your cart.
        </p>

        {paymentStatus.orderId && (
          <p className="text-sm text-gray-500 mb-4">
            Order ID: {paymentStatus.orderId}
          </p>
        )}

        {paymentStatus.error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
            <p className="text-sm text-red-700">{paymentStatus.error}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => router.push("/account/checkout")}
            className="w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push("/account/cart")}
            className="w-full bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            Review Cart
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full text-gray-600 px-6 py-2 rounded-md hover:text-gray-800 transition-colors"
          >
            Continue Shopping
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>Need help? Contact our support team.</p>
        </div>
      </div>
    </div>
  );
}
