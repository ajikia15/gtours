import { Badge } from "@/components/ui/badge";
import { BlogStatus } from "@/validation/blogSchema";
import { useTranslations } from "next-intl";

interface BlogStatusBadgeProps {
  status: BlogStatus;
}

export default function BlogStatusBadge({ status }: BlogStatusBadgeProps) {
  const t = useTranslations("Admin.status");

  const getStatusVariant = (status: BlogStatus) => {
    switch (status) {
      case "published":
        return "default"; // Green-ish
      case "draft":
        return "secondary"; // Gray
      case "archived":
        return "destructive"; // Red
      default:
        return "secondary";
    }
  };

  const getStatusText = (status: BlogStatus) => {
    switch (status) {
      case "published":
        return t("published");
      case "draft":
        return t("draft");
      case "archived":
        return t("archived");
      default:
        return status;
    }
  };

  return (
    <Badge variant={getStatusVariant(status)}>{getStatusText(status)}</Badge>
  );
}
