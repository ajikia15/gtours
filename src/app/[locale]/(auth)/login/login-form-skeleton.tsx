import { Skeleton } from "@/components/ui/skeleton";
import { CardContent, CardFooter } from "@/components/ui/card";

export default function LoginFormSkeleton() {
  return (
    <>
      <CardContent>
        <div className="space-y-4">
          {/* Email field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-10" /> {/* Email label */}
            <Skeleton className="h-10 w-full" /> {/* Email input */}
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-16" /> {/* Password label */}
              <Skeleton className="h-4 w-24" /> {/* Forgot password link */}
            </div>
            <Skeleton className="h-10 w-full" /> {/* Password input */}
          </div>

          {/* Login button */}
          <Skeleton className="h-10 w-full" />

          {/* "or" text */}
          <div className="text-center">
            <Skeleton className="h-4 w-4 mx-auto" />
          </div>

          {/* Google button */}
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground gap-1">
        <Skeleton className="h-4 w-32" /> {/* "Don't have an account?" text */}
        <Skeleton className="h-6 w-16" /> {/* Register button */}
      </CardFooter>
    </>
  );
}
