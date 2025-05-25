import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Suspense } from "react";
import LoginForm from "./login-form";
import LoginFormSkeleton from "./login-form-skeleton";

export default function LoginPage() {
  return (
    <Card className="w-full max-w-md mx-auto my-40">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<LoginFormSkeleton />}>
          <LoginForm />
        </Suspense>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground gap-1">
        <span>Dont have an account?</span>
        <Link
          href="/register"
          className="text-brand-secondary hover:underline font-medium"
        >
          Register
        </Link>
      </CardFooter>
    </Card>
  );
}
