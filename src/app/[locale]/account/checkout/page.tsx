import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { verifyUserToken } from "@/lib/auth-utils";
import { getUserProfile, isProfileComplete } from "@/data/userProfile";
import { getUserCart } from "@/data/cart";
import { UserProfile } from "@/types/User";
import CheckoutClient from "./checkout-client";

export default async function CheckoutPage() {
  const locale = await getLocale();

  let userProfile: UserProfile | null = null;
  let profileComplete = false;
  let hasCartItems = false;

  try {
    await verifyUserToken();
    userProfile = await getUserProfile();
    profileComplete = await isProfileComplete();

    // Check if user has items in cart
    const cartResult = await getUserCart();
    if (cartResult.success && cartResult.cart) {
      hasCartItems = cartResult.cart.items.length > 0;
    }
  } catch (e) {
    redirect({ href: "/login", locale: locale });
    throw e;
  }

  // Redirect to cart if no items
  if (!hasCartItems) {
    redirect({ href: "/account/cart", locale: locale });
    throw new Error("No items in cart");
  }

  return (
    <>
      <CheckoutClient
        initialUserProfile={userProfile}
        initialProfileComplete={profileComplete}
      />
    </>
  );
}
