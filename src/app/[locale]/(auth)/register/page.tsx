import { Link } from "@/i18n/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RegisterForm from "./register-form";
export default function RegisterPage() {
  return (
    <Card className="w-full max-w-md mx-auto my-40">
      <CardHeader>
        <CardTitle>Register</CardTitle>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground gap-1">
        <span>Already have an account?</span>
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
