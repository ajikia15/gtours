import { getAllActivityTypes } from "@/data/activities"; // Changed
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  // TableFooter, // Removed for now as pagination is simplified
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
// Pagination components removed for now
import { Link } from "@/i18n/navigation";
import { Pencil, Trash } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ActivityType } from "@/types/Activity"; // Import ActivityType
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

// TODO: Implement pagination in getAllActivityTypes and re-enable here
export default async function ActivitiesTable({
  page = 1,
  params, // Changed: accept params object
}: {
  page?: number;
  params: { locale: string }; // Changed: define type for params
}) {
  const t = await getTranslations("AdminActivitiesTable");
  const activityTypes: ActivityType[] = await getAllActivityTypes();
  const locale = params.locale; // Extract locale

  // For delete functionality, we'll need a server action
  // For now, buttons will be placeholders or link to edit

  return (
    <>
      {!activityTypes?.length && (
        <div className="flex items-center justify-center h-full">
          <p className="text-sm text-muted-foreground">
            {t("noActivitiesFound")}
          </p>
        </div>
      )}
      {activityTypes?.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Icon</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>ID (Translation Key)</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activityTypes.map((activityType) => (
              <TableRow key={activityType.id}>
                <TableCell>
                  {activityType.pngFileName ? (
                    <div className="relative h-8 w-8">
                      <Image
                        src={`/${activityType.pngFileName}.png`}
                        alt={activityType.name}
                        fill
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  ) : (
                    <div className="h-8 w-8 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                      N/A
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  {activityType.name}
                </TableCell>
                <TableCell>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {activityType.id}
                  </code>
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {activityType.genericDescription || "No description"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={activityType.isActive ? "default" : "secondary"}
                  >
                    {activityType.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="flex items-center gap-1">
                  {/* Edit link */}
                  <Link
                    href={`/${locale}/admin/activities/edit/${activityType.id}`}
                  >
                    <Button variant="outline" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  {/* Delete button - will require a server action */}
                  <Button variant="outline" size="icon" disabled>
                    {" "}
                    {/* Disabled for now */}
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {/* Footer and Pagination removed for now */}
        </Table>
      )}
    </>
  );
}
