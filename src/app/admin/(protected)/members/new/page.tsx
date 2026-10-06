import { MemberForm } from "@/components/admin/member-form";
import { PageHeader } from "@/components/admin/page-header";
import { toDateInput, todayUTC } from "@/lib/dates";
import { prisma } from "@/lib/prisma";
import { createMember } from "../actions";

export default async function NewMemberPage() {
  const plans = await prisma.membershipPlan.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } });

  return (
    <div className="grid max-w-3xl gap-6">
      <PageHeader
        title="Add member"
        description="Sign someone up, and record an advance if they paid only part of the fee."
      />
      <MemberForm
        mode="create"
        today={toDateInput(todayUTC())}
        plans={plans}
        onSubmit={createMember}
        cancelHref="/admin/members"
      />
    </div>
  );
}
