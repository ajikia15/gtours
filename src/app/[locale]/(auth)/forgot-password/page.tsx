import { Link } from "@/i18n/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Suspense } from "react";
import ForgotPasswordForm from "./forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <Card className="w-full max-w-md mx-auto my-40">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<div>Loading...</div>}>
          <ForgotPasswordForm />
        </Suspense>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground gap-1">
        <span>Remember your password?</span>
        <Link
          href="/login"
          className="text-brand-secondary hover:underline font-medium"
        >
          Login
        </Link>
      </CardFooter>
    </Card>
  );
}
