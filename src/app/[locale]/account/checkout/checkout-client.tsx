"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCartIcon, LockIcon, CheckCircleIcon } from "lucide-react";
import UserProfileForm from "@/components/user-profile-form";
import OrderSummary from "@/components/order-summary";
import { UserProfile } from "@/types/User";
import { useCart } from "@/context/cart";
import { Link, useRouter } from "@/i18n/navigation";
import { processCheckout } from "@/data/checkout";

interface CheckoutClientProps {
  initialUserProfile: UserProfile | null;
  initialProfileComplete: boolean;
  directTourId?: string;
}

export default function CheckoutClient({
  initialUserProfile,
  initialProfileComplete,
  directTourId,
}: CheckoutClientProps) {
  const cart = useCart();
  const router = useRouter();
  const [userProfile] = useState<UserProfile | null>(initialUserProfile);
  const [profileComplete] = useState(initialProfileComplete);
  const [isProcessing, setIsProcessing] = useState(false);

  // In direct tour mode, filter cart to show only the specific tour
  const isDirectTourMode = Boolean(directTourId);
  const relevantCartItems = useMemo(() => {
    if (!isDirectTourMode) return cart.items;
    return cart.items.filter((item) => item.tourId === directTourId);
  }, [cart.items, directTourId, isDirectTourMode]);
  // Calculate totals for the relevant items
  const totalItems = relevantCartItems.length;
  const totalPrice = relevantCartItems.reduce(
    (sum, item) => sum + (item.totalPrice || 0),
    0
  );
  // Create custom order items for direct tour mode
  const customOrderItems = relevantCartItems.map((item) => ({
    id: item.id,
    name: item.tourTitle,
    price: item.totalPrice || 0,
    quantity: 1,
    description: `${
      item.selectedDate
        ? item.selectedDate instanceof Date
          ? item.selectedDate.toLocaleDateString()
          : new Date(item.selectedDate).toLocaleDateString()
        : "Date TBD"
    } • ${
      (item.travelers?.adults || 0) +
      (item.travelers?.children || 0) +
      (item.travelers?.infants || 0)
    } travelers`,
  }));

  const handleProfileComplete = () => {
    // Refresh the page to get updated profile data
    window.location.reload();
  };
  const handleCompleteCheckout = async () => {
    try {
      setIsProcessing(true);

      // Process checkout and create invoice
      // In direct tour mode, we could modify this to process only the specific tour
      // For now, we'll process the full cart but the user only sees the relevant tour
      const result = await processCheckout();

      if (result.success) {
        // Show success message
        toast.success(result.message || "Checkout completed successfully!");

        // Redirect to success page with invoice details
        router.push(`/account/orders?invoice=${result.invoiceId}`);
      } else {
        // Show error message
        toast.error(result.message || "Checkout failed. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
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
  if (relevantCartItems.length === 0) {
    return (
      <div className="max-w-screen-lg mx-auto p-6">
        <div className="text-center space-y-4">
          <ShoppingCartIcon className="h-16 w-16 mx-auto text-gray-400" />
          <h1 className="text-2xl font-bold">
            {isDirectTourMode ? "Tour not found in cart" : "Your cart is empty"}
          </h1>
          <p className="text-gray-600">
            {isDirectTourMode
              ? "The requested tour could not be found. Please try booking again."
              : "Add some tours to your cart before checkout"}
          </p>
          <Link href={isDirectTourMode ? "/" : "/account/cart"}>
            <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
              {isDirectTourMode ? "Browse Tours" : "Go to Cart"}
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
        <h1 className="text-2xl font-bold">
          {isDirectTourMode ? "Book Tour" : "Checkout"}
        </h1>
        <span className="bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
          {totalItems} {totalItems === 1 ? "item" : "items"}
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

            <UserProfileForm
              initialData={userProfile}
              mode="required"
              onComplete={handleProfileComplete}
              showTitle={false}
              showCard={true}
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
            mode={isDirectTourMode ? "custom" : "cart"}
            customItems={isDirectTourMode ? customOrderItems : undefined}
            customSubtotal={isDirectTourMode ? totalPrice : undefined}
            customTotal={isDirectTourMode ? totalPrice : undefined}
            isCheckout={true}
            disabled={!profileComplete || isProcessing}
            buttonAction={handleCompleteCheckout}
            buttonText={
              isProcessing
                ? "Processing..."
                : profileComplete
                ? `Complete Purchase - ${totalPrice} GEL`
                : undefined
            }
            title={isDirectTourMode ? "Tour Summary" : "Order Summary"}
          />
        </div>
      </div>
    </div>
  );
}
