import { Breadcrumbs } from "@/components/ui/breadcrumb";
import NewTourForm from "./new-tour-form";

export default function NewTour() {
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Admin Dashboard", href: "/admin" },
          { label: "Tours" },
          { label: "New Tour" },
        ]}
      />

      <NewTourForm />
    </div>
  );
}
