import { Breadcrumbs } from "@/components/ui/breadcrumb";

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
      <h1 className="text-2xl font-bold">New Tour</h1>
    </div>
  );
}
