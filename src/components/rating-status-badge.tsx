import { Badge } from "@/components/ui/badge";
import { RatingStatus } from "@/types/Rating";

type RatingStatusBadgeProps = {
  status: RatingStatus;
};

export default function RatingStatusBadge({ status }: RatingStatusBadgeProps) {
  const getStatusColor = (status: RatingStatus) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      case "draft":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <Badge className={getStatusColor(status)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
