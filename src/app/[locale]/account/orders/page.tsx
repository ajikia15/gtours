import { Suspense } from "react";
import { getCurrentUserToken } from "@/lib/auth-utils";
import { getInvoiceStatus } from "@/data/checkout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircleIcon, DownloadIcon, AlertCircleIcon } from "lucide-react";
import { redirect } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

interface OrdersPageProps {
  searchParams: Promise<{ invoice?: string }>;
}

async function OrderContent({ invoiceId }: { invoiceId?: string }) {
  const t = await getTranslations("Orders");
  if (!invoiceId) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">{t("yourOrders")}</h1>
          <p className="text-gray-600">{t("noRecentOrders")}</p>
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
          <h1 className="text-2xl font-bold">{t("orderNotFound")}</h1>
          <p className="text-gray-600">{t("orderNotFoundDescription")}</p>
        </div>
      </div>
    );
  }
  const { invoice } = result;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold">{t("orderCompleted")}</h1>
        <p className="text-gray-600">{t("invoiceGenerated")}</p>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
          <p className="text-sm text-amber-800">
            <strong>📧 {t("emailNoteLabel")}</strong> {t("emailNoteText")}
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t("orderDetails")}</span>
            <Badge variant="default">{t("completed")}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">{t("invoiceNumber")}</p>
              <p className="font-semibold">{invoice.data?.invoiceNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t("invoiceDate")}</p>
              <p className="font-semibold">{invoice.data?.invoiceDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t("customer")}</p>
              <p className="font-semibold">{invoice.data?.customer?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t("expectedGuestDate")}</p>
              <p className="font-semibold">
                {invoice.data?.summary?.startDate}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t("totalAmount")}</p>
              <p className="font-semibold">
                {invoice.data?.summary?.totalPrice}
                {invoice.data?.summary?.currency}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <a
              href={invoice.downloadURL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              <DownloadIcon className="h-4 w-4" />
              {t("downloadInvoicePDF")}
            </a>
          </div>
        </CardContent>
      </Card>
      {invoice.data?.tourDetails && invoice.data.tourDetails.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("orderedTours")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  // Await the searchParams promise
  const resolvedSearchParams = await searchParams;

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
      <OrderContent invoiceId={resolvedSearchParams.invoice} />
    </Suspense>
  );
}
