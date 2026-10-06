"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { fromZodError, type ActionResult } from "@/lib/action-result";
import { prisma } from "@/lib/prisma";
import { planSchema, type PlanInput } from "@/lib/validators";

function refresh() {
  revalidatePath("/admin", "layout");
  revalidatePath("/");
}

export async function createPlan(values: PlanInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = planSchema.safeParse(values);
  if (!parsed.success) return fromZodError(parsed.error);
  const count = await prisma.membershipPlan.count();
  await prisma.membershipPlan.create({
    data: { ...parsed.data, note: parsed.data.note || null, sortOrder: count },
  });
  refresh();
  redirect("/admin/plans");
}

export async function updatePlan(id: string, values: PlanInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = planSchema.safeParse(values);
  if (!parsed.success) return fromZodError(parsed.error);
  const result = await prisma.membershipPlan.updateMany({
    where: { id },
    data: { ...parsed.data, note: parsed.data.note || null },
  });
  if (result.count === 0) return { ok: false, message: "This plan no longer exists." };
  refresh();
  redirect("/admin/plans");
}

export async function setPlanActive(id: string, active: boolean): Promise<ActionResult> {
  await requireAdmin();
  await prisma.membershipPlan.updateMany({ where: { id }, data: { active } });
  refresh();
  return { ok: true, message: active ? "Shown on the website" : "Hidden from the website" };
}

export async function deletePlan(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.membershipPlan.deleteMany({ where: { id } });
  refresh();
  return { ok: true, message: "Plan deleted" };
}

export async function movePlan(id: string, direction: "up" | "down"): Promise<ActionResult> {
  await requireAdmin();
  const plans = await prisma.membershipPlan.findMany({ orderBy: { sortOrder: "asc" } });
  const index = plans.findIndex((p) => p.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapWith < 0 || swapWith >= plans.length) return { ok: true };

  await prisma.$transaction([
    prisma.membershipPlan.update({ where: { id: plans[index].id }, data: { sortOrder: plans[swapWith].sortOrder } }),
    prisma.membershipPlan.update({ where: { id: plans[swapWith].id }, data: { sortOrder: plans[index].sortOrder } }),
  ]);
  refresh();
  return { ok: true };
}
