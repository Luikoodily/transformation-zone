import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { PlanForm } from "@/components/admin/plan-form";
import { prisma } from "@/lib/prisma";
import { updatePlan } from "../actions";

export default async function EditPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plan = await prisma.membershipPlan.findUnique({ where: { id } });
  if (!plan) notFound();

  return (
    <div className="grid max-w-2xl gap-6">
      <PageHeader title={plan.title} />
      <PlanForm
        mode="edit"
        defaults={{
          title: plan.title,
          amount: String(plan.amount),
          months: String(plan.months),
          note: plan.note ?? "",
          active: plan.active,
        }}
        onSubmit={updatePlan.bind(null, plan.id)}
      />
    </div>
  );
}
