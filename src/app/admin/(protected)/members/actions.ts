"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { fromZodError, type ActionResult } from "@/lib/action-result";
import { parseDateInput } from "@/lib/dates";
import { formatINR } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import {
  memberCreateSchema,
  memberStatusSchema,
  memberUpdateSchema,
  paymentSchema,
  type MemberCreateInput,
  type MemberUpdateInput,
  type PaymentInput,
} from "@/lib/validators";

function refreshAdmin() {
  revalidatePath("/admin", "layout");
}

async function totalPaid(memberId: string): Promise<number> {
  const result = await prisma.payment.aggregate({
    where: { memberId },
    _sum: { amount: true },
  });
  return result._sum.amount ?? 0;
}

export async function createMember(values: MemberCreateInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = memberCreateSchema.safeParse(values);
  if (!parsed.success) return fromZodError(parsed.error);
  const v = parsed.data;

  const member = await prisma.member.create({
    data: {
      name: v.name,
      phone: v.phone,
      plan: v.plan,
      planPrice: v.planPrice,
      startDate: parseDateInput(v.startDate),
      endDate: parseDateInput(v.endDate),
      balanceDueBy: v.balanceDueBy ? parseDateInput(v.balanceDueBy) : null,
      notes: v.notes || null,
      payments:
        v.paymentAmount > 0
          ? {
              create: {
                amount: v.paymentAmount,
                paidAt: parseDateInput(v.paymentDate),
                method: v.paymentMethod,
              },
            }
          : undefined,
    },
  });

  refreshAdmin();
  redirect(`/admin/members/${member.id}`);
}

export async function updateMember(id: string, values: MemberUpdateInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = memberUpdateSchema.safeParse(values);
  if (!parsed.success) return fromZodError(parsed.error);
  const v = parsed.data;

  const existing = await prisma.member.findUnique({ where: { id }, select: { id: true } });
  if (!existing) return { ok: false, message: "This member no longer exists." };

  const paid = await totalPaid(id);
  if (v.planPrice < paid) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: {
        planPrice: `Plan price can't be lower than the ${formatINR(paid)} already paid.`,
      },
    };
  }

  await prisma.member.update({
    where: { id },
    data: {
      name: v.name,
      phone: v.phone,
      plan: v.plan,
      planPrice: v.planPrice,
      startDate: parseDateInput(v.startDate),
      endDate: parseDateInput(v.endDate),
      balanceDueBy: v.balanceDueBy ? parseDateInput(v.balanceDueBy) : null,
      notes: v.notes || null,
    },
  });

  refreshAdmin();
  return { ok: true, message: "Member updated" };
}

export async function recordPayment(memberId: string, values: PaymentInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = paymentSchema.safeParse(values);
  if (!parsed.success) return fromZodError(parsed.error);
  const v = parsed.data;

  const member = await prisma.member.findUnique({
    where: { id: memberId },
    select: { planPrice: true },
  });
  if (!member) return { ok: false, message: "This member no longer exists." };

  const balance = Math.max(member.planPrice - (await totalPaid(memberId)), 0);
  if (balance === 0) {
    return { ok: false, message: "Nothing is due — this plan is already paid in full." };
  }
  if (v.amount > balance) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: { amount: `Only ${formatINR(balance)} is due on this plan.` },
    };
  }

  await prisma.payment.create({
    data: {
      memberId,
      amount: v.amount,
      paidAt: parseDateInput(v.paidAt),
      method: v.method,
      note: v.note || null,
    },
  });

  refreshAdmin();
  return {
    ok: true,
    message:
      v.amount === balance
        ? `${formatINR(v.amount)} recorded — paid in full`
        : `${formatINR(v.amount)} recorded — ${formatINR(balance - v.amount)} still due`,
  };
}

export async function deletePayment(paymentId: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.payment.deleteMany({ where: { id: paymentId } });
  refreshAdmin();
  return { ok: true, message: "Payment removed" };
}

export async function setMemberStatus(id: string, status: string): Promise<ActionResult> {
  await requireAdmin();
  const parsed = memberStatusSchema.safeParse(status);
  if (!parsed.success) return { ok: false, message: "Unknown status" };

  await prisma.member.updateMany({ where: { id }, data: { status: parsed.data } });
  refreshAdmin();
  return { ok: true, message: `Marked ${parsed.data.toLowerCase()}` };
}

export async function deleteMember(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.member.deleteMany({ where: { id } });
  refreshAdmin();
  redirect("/admin/members");
}
