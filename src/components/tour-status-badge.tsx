import { TourStatus } from "@/validation/tourSchema";
import { Badge } from "./ui/badge";

const statusLabel = {
  draft: "Draft",
  disabled: "Disabled",
  active: "Active",
};
const variant: {
  [key: string]: "default" | "destructive" | "outline" | "secondary";
} = {
  draft: "outline",
  disabled: "secondary",
  active: "default",
};
export default function TourStatusBadge({ status }: { status: TourStatus }) {
  const label = statusLabel[status];
  return <Badge variant={variant[status]}>{label}</Badge>;
}
