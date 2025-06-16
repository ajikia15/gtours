import FormSkeleton from "@/components/ui/form-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-5 w-64 mx-auto" />
        </div>

        {/* Form card */}
        <div className="bg-white shadow-lg rounded-lg p-6 border">
          <FormSkeleton fields={3} title={false} />

          {/* Or divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <Skeleton className="h-4 w-8 mx-4" />
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* OAuth button */}
          <Skeleton className="h-12 w-full" />
        </div>

        {/* Footer links */}
        <div className="text-center">
          <Skeleton className="h-4 w-56 mx-auto" />
        </div>
      </div>
    </div>
  );
}
