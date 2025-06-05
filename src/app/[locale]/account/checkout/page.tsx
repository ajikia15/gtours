import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { requireUserAuth } from "@/lib/auth-utils";
import { getUserProfile, isProfileComplete } from "@/data/userProfile";
import { getUserCart } from "@/data/cart";
import { UserProfile } from "@/types/User";
import CheckoutClient from "./checkout-client";

interface CheckoutPageProps {
  searchParams: Promise<{
    directTour?: string;
  }>;
}

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const locale = await getLocale();
  const resolvedSearchParams = await searchParams;
  const directTourId = resolvedSearchParams.directTour;

  let userProfile: UserProfile | null = null;
  let profileComplete = false;
  let hasCartItems = false;

  try {
    await requireUserAuth();
    userProfile = await getUserProfile();
    profileComplete = await isProfileComplete();

    // Check if user has items in cart
    const cartResult = await getUserCart();
    if (cartResult.success && cartResult.cart) {
      hasCartItems = cartResult.cart.length > 0;
    }
  } catch (e) {
    redirect({ href: "/login", locale: locale });
    throw e;
  }

  // For direct tour checkout, we allow proceeding even if cart appears empty
  // since the tour should have been added to cart in the proceedToDirectCheckout function
  if (!hasCartItems && !directTourId) {
    redirect({ href: "/account/cart", locale: locale });
    throw new Error("No items in cart");
  }
  return (
    <>
      <CheckoutClient
        initialUserProfile={userProfile}
        initialProfileComplete={profileComplete}
        directTourId={directTourId}
      />
    </>
  );
}
