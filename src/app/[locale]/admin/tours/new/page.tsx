import { Breadcrumbs } from "@/components/ui/breadcrumb";

export default function NewTour() {
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Admin Dashboard", href: "/admin" },
          { label: "New Tour" },
        ]}
      />
    </div>
  );
}
