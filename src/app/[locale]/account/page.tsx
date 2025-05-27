import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { DecodedIdToken } from "firebase-admin/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { verifyUserToken } from "@/lib/auth-utils";

export default async function AccountPage() {
  const locale = await getLocale();

  let decodedToken: DecodedIdToken;
  try {
    decodedToken = await verifyUserToken();
  } catch (e) {
    redirect({ href: "/login", locale: locale });
    throw e;
  }

  return (
    <div className="max-w-screen-md mx-auto">
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
