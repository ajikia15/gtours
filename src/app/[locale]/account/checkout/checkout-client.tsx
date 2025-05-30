"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCartIcon, LockIcon, CheckCircleIcon } from "lucide-react";
import RequiredUserInfo from "@/components/required-user-info";
import OrderSummary from "@/components/order-summary";
import { UserProfile } from "@/types/User";
import { useCart } from "@/context/cart";
import { useAuth } from "@/context/auth";
import { Link, useRouter } from "@/i18n/navigation";

interface CheckoutClientProps {
  initialUserProfile: UserProfile | null;
  initialProfileComplete: boolean;
}

export default function CheckoutClient({
  initialUserProfile,
  initialProfileComplete,
}: CheckoutClientProps) {
  const cart = useCart();
  const auth = useAuth();
  const router = useRouter();
  const [userProfile] = useState<UserProfile | null>(initialUserProfile);
  const [profileComplete] = useState(initialProfileComplete);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!auth?.currentUser) {
      router.push("/login");
    }
  }, [auth?.currentUser, router]);

  const handleProfileComplete = () => {
    // Refresh the page to get updated profile data
    window.location.reload();
  };

  const handleCompleteCheckout = () => {
    // Handle the actual checkout process
    console.log("Processing checkout with cart items:", cart.items);
    console.log("Total amount:", cart.totalPrice, "GEL");
    // This would typically integrate with payment processing
    // Could call a server action to process the payment and create order
  };

  // Show loading state
  if (cart.loading) {
    return (
      <div className="max-w-screen-lg mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Guard: Show empty cart message instead of redirecting
  if (cart.items.length === 0) {
    return (
      <div className="max-w-screen-lg mx-auto p-6">
        <div className="text-center space-y-4">
          <ShoppingCartIcon className="h-16 w-16 mx-auto text-gray-400" />
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="text-gray-600">
            Add some tours to your cart before checkout
          </p>
          <Link href="/account/cart">
            <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
              Go to Cart
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingCartIcon className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Checkout</h1>
        <span className="bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
          {cart.totalItems} {cart.totalItems === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - User Info and Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: User Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  profileComplete
                    ? "bg-green-500 text-white"
                    : "bg-blue-500 text-white"
                }`}
              >
                {profileComplete ? "✓" : "1"}
              </div>
              <h2 className="text-lg font-semibold">Contact Information</h2>
              {profileComplete && (
                <Badge variant="default" className="text-xs">
                  <CheckCircleIcon className="h-3 w-3 mr-1" />
                  Complete
                </Badge>
              )}
            </div>

            <RequiredUserInfo
              initialData={userProfile}
              onComplete={handleProfileComplete}
              showTitle={false}
              title=""
              description=""
            />
          </div>

          {/* Step 2: Payment Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  profileComplete
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                2
              </div>
              <h2 className="text-lg font-semibold">Payment Information</h2>
              {!profileComplete && (
                <Badge variant="secondary" className="text-xs">
                  <LockIcon className="h-3 w-3 mr-1" />
                  Locked
                </Badge>
              )}
            </div>

            <Card className={!profileComplete ? "opacity-50" : ""}>
              <CardHeader>
                <CardTitle className="text-base">Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!profileComplete && (
                  <div className="flex items-center justify-center p-8 text-center">
                    <div className="space-y-2">
                      <LockIcon className="h-8 w-8 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-500">
                        Complete your contact information to proceed with
                        payment
                      </p>
                    </div>
                  </div>
                )}

                {profileComplete && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          defaultValue={
                            profileComplete
                              ? `${userProfile?.firstName} ${userProfile?.lastName}`
                              : ""
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <OrderSummary
            mode="cart"
            isCheckout={true}
            disabled={!profileComplete}
            buttonAction={handleCompleteCheckout}
            buttonText={
              profileComplete
                ? `Complete Purchase - ${cart.totalPrice} GEL`
                : undefined
            }
          />
        </div>
      </div>
    </div>
  );
}
