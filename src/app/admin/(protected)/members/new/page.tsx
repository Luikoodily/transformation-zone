import { MemberForm } from "@/components/admin/member-form";
import { PageHeader } from "@/components/admin/page-header";
import { toDateInput, todayUTC } from "@/lib/dates";
import { createMember } from "../actions";

export default function NewMemberPage() {
  return (
    <div className="grid max-w-3xl gap-6">
      <PageHeader
        title="Add member"
        description="Sign someone up, and record an advance if they paid only part of the fee."
      />
      <MemberForm
        mode="create"
        today={toDateInput(todayUTC())}
        onSubmit={createMember}
        cancelHref="/admin/members"
      />
    </div>
  );
}
