import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { StaffForm } from "@/components/admin/staff-form";
import { prisma } from "@/lib/prisma";
import { updateStaff } from "../actions";

export default async function EditStaffPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const staff = await prisma.staff.findUnique({ where: { id } });
  if (!staff) notFound();

  return (
    <div className="grid max-w-3xl gap-6">
      <PageHeader title={staff.name} description="Edit this staff member's details." />
      <StaffForm
        mode="edit"
        defaults={{ name: staff.name, role: staff.role, phone: staff.phone }}
        onSubmit={updateStaff.bind(null, staff.id)}
      />
    </div>
  );
}
