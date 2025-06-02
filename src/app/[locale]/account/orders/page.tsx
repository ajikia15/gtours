import { Suspense } from "react";
import { getCurrentUserToken } from "@/lib/auth-utils";
import { getInvoiceStatus } from "@/data/checkout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
  DownloadIcon,
} from "lucide-react";
import { redirect } from "@/i18n/navigation";

interface OrdersPageProps {
  searchParams: { invoice?: string };
}

async function OrderContent({ invoiceId }: { invoiceId?: string }) {
  if (!invoiceId) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Your Orders</h1>
          <p className="text-gray-600">No recent orders found.</p>
        </div>
      </div>
    );
  }
  // gtours-fcd56.firebasestorage.app/template/gtours-invoice.zip
  const user = await getCurrentUserToken();
  if (!user) {
    redirect({ href: "/login", locale: "en" });
  }

  const result = await getInvoiceStatus(invoiceId);

  if (!result.success || !result.invoice) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center space-y-4">
          <AlertCircleIcon className="h-16 w-16 mx-auto text-red-500" />
          <h1 className="text-2xl font-bold">Order Not Found</h1>
          <p className="text-gray-600">
            The requested order could not be found.
          </p>
        </div>
      </div>
    );
  }

  const { invoice } = result;
  const isCompleted = invoice.status === "completed";
  const isPending =
    invoice.status === "pending" || invoice.status === "processing";
  const hasError = invoice.status === "error";

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center">
          {isCompleted && (
            <CheckCircleIcon className="h-16 w-16 text-green-500" />
          )}
          {isPending && <ClockIcon className="h-16 w-16 text-blue-500" />}
          {hasError && <AlertCircleIcon className="h-16 w-16 text-red-500" />}
        </div>

        <h1 className="text-3xl font-bold">
          {isCompleted && "Order Completed!"}
          {isPending && "Processing Your Order"}
          {hasError && "Order Processing Error"}
        </h1>

        <p className="text-gray-600">
          {isCompleted &&
            "Your invoice has been generated and sent to your email."}
          {isPending &&
            "We're generating your invoice. You'll receive an email shortly."}
          {hasError &&
            "There was an error processing your order. Please contact support."}
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Order Details</span>
            <Badge
              variant={
                isCompleted
                  ? "default"
                  : isPending
                  ? "secondary"
                  : "destructive"
              }
            >
              {invoice.status}
            </Badge>
          </CardTitle>
        </CardHeader>{" "}
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Invoice Number</p>
              <p className="font-semibold">{invoice.data?.invoiceNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Invoice Date</p>
              <p className="font-semibold">{invoice.data?.invoiceDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Customer</p>
              <p className="font-semibold">{invoice.data?.customer?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="font-semibold">
                {invoice.data?.summary?.totalPrice}{" "}
                {invoice.data?.summary?.currency}
              </p>
            </div>
          </div>

          {isCompleted && invoice.downloadURL && (
            <div className="pt-4 border-t">
              <a
                href={invoice.downloadURL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                <DownloadIcon className="h-4 w-4" />
                Download Invoice PDF
              </a>
            </div>
          )}

          {hasError && invoice.error && (
            <div className="pt-4 border-t">
              <p className="text-sm text-red-600">Error: {invoice.error}</p>
            </div>
          )}
        </CardContent>
      </Card>{" "}
      {invoice.data?.tourDetails && invoice.data.tourDetails.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Ordered Tours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {" "}
              {invoice.data.tourDetails.map(
                (
                  tour: {
                    tourTitle: string;
                    selectedDate: string;
                    travelers: string;
                    activities: string[];
                    price: number;
                  },
                  index: number
                ) => (
                  <div key={index} className="border rounded p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{tour.tourTitle}</h3>
                        <p className="text-sm text-gray-600">
                          📅 {tour.selectedDate}
                        </p>
                        <p className="text-sm text-gray-600">
                          👥 {tour.travelers}
                        </p>
                        {tour.activities && tour.activities.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {tour.activities.map(
                              (activity: string, actIndex: number) => (
                                <Badge
                                  key={actIndex}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {activity}
                                </Badge>
                              )
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {tour.price} {invoice.data?.summary?.currency}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function OrdersPage({ searchParams }: OrdersPageProps) {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      }
    >
      <OrderContent invoiceId={searchParams.invoice} />
    </Suspense>
  );
}
