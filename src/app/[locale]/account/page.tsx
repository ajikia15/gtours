import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { DecodedIdToken } from "firebase-admin/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { verifyUserToken } from "@/lib/auth-utils";
import { getUserProfile } from "@/data/userProfile";
import { UserProfile } from "@/types/User";
import { ShieldCheckIcon, PhoneIcon, UserIcon } from "lucide-react";
import UserProfileForm from "@/components/user-profile-form";

export default async function AccountPage() {
  const locale = await getLocale();

  let decodedToken: DecodedIdToken;
  let userProfile: UserProfile | null = null;

  try {
    decodedToken = await verifyUserToken();
    userProfile = await getUserProfile();
  } catch (e) {
    redirect({ href: "/login", locale: locale });
    throw e;
  }

  return (
    <div className="max-w-screen-lg mx-auto space-y-6">
      {/* Account Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            My Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Email</Label>
            <div className="text-base">{decodedToken.email}</div>
          </div>

          {userProfile && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Name</Label>
                <div className="text-base">
                  {userProfile.firstName} {userProfile.lastName}
                </div>
              </div>

              {userProfile.phoneNumber && (
                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <PhoneIcon className="h-4 w-4" />
                    Phone Number
                    {userProfile.phoneVerified ? (
                      <Badge variant="default" className="text-xs">
                        <ShieldCheckIcon className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-xs">
                        Not Verified
                      </Badge>
                    )}
                  </Label>
                  <div className="text-base">{userProfile.phoneNumber}</div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Update Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <UserProfileForm initialData={userProfile} />
        </CardContent>
      </Card>
    </div>
  );
}
