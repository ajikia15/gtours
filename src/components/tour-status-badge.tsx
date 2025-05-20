import { TourStatus } from "@/validation/tourSchema";
import { Badge } from "./ui/badge";

const statusLabel = {
  draft: "Draft",
  disabled: "Disabled",
  active: "Active",
};
const variant: { [key: string]: "default" | "destructive" | "outline" } = {
  draft: "default",
  disabled: "outline",
  active: "destructive",
};
export default function TourStatusBadge({ status }: { status: TourStatus }) {
  const label = statusLabel[status];
  return <Badge variant={variant[status]}>{label}</Badge>;
}
