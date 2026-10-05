import { PageHeader } from "@/components/admin/page-header";
import { StaffForm } from "@/components/admin/staff-form";
import { createStaff } from "../actions";

export default function NewStaffPage() {
  return (
    <div className="grid max-w-3xl gap-6">
      <PageHeader title="Add staff" description="Add a trainer or front-desk team member." />
      <StaffForm mode="create" onSubmit={createStaff} />
    </div>
  );
}
