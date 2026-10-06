import { PageHeader } from "@/components/admin/page-header";
import { PlanForm } from "@/components/admin/plan-form";
import { createPlan } from "../actions";

export default function NewPlanPage() {
  return (
    <div className="grid max-w-2xl gap-6">
      <PageHeader title="Add plan" />
      <PlanForm mode="create" onSubmit={createPlan} />
    </div>
  );
}
