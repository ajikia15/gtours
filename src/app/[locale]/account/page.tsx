import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { DecodedIdToken } from "firebase-admin/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { verifyUserToken } from "@/lib/auth-utils";

export default async function AccountPage() {
  const locale = await getLocale();

  // Verify token and obtain user info
  let decodedToken: DecodedIdToken;
  try {
    decodedToken = await verifyUserToken();
  } catch (e) {
    // Token validation will be handled by middleware
    redirect({ href: "/login", locale: locale });
    // TypeScript needs this to understand the code path
    throw e;
  }

  return (
    <div className="max-w-screen-md">
      <Card>
        <CardHeader>
          <CardTitle>My Account</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>Email</Label>
          <div>{decodedToken.email}</div>
        </CardContent>
      </Card>
    </div>
  );
}
