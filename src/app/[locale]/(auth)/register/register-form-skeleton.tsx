import { Skeleton } from "@/components/ui/skeleton";

export default function RegisterFormSkeleton() {
  return (
    <div className="space-y-4">
      {/* Email field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-10" /> {/* Email label */}
        <Skeleton className="h-10 w-full" /> {/* Email input */}
      </div>

      {/* First Name field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" /> {/* First Name label */}
        <Skeleton className="h-10 w-full" /> {/* First Name input */}
      </div>

      {/* Last Name field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" /> {/* Last Name label */}
        <Skeleton className="h-10 w-full" /> {/* Last Name input */}
      </div>

      {/* Password field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" /> {/* Password label */}
        <Skeleton className="h-10 w-full" /> {/* Password input */}
      </div>

      {/* Confirm Password field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" /> {/* Confirm Password label */}
        <Skeleton className="h-10 w-full" /> {/* Confirm Password input */}
      </div>

      {/* Register button */}
      <Skeleton className="h-10 w-full" />

      {/* "or" text */}
      <div className="text-center">
        <Skeleton className="h-4 w-4 mx-auto" />
      </div>

      {/* Google button */}
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
