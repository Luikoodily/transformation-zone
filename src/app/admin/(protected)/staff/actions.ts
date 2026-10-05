"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { fromZodError, type ActionResult } from "@/lib/action-result";
import { prisma } from "@/lib/prisma";
import { staffSchema, type StaffInput } from "@/lib/validators";

function refreshAdmin() {
  revalidatePath("/admin", "layout");
}

export async function createStaff(values: StaffInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = staffSchema.safeParse(values);
  if (!parsed.success) return fromZodError(parsed.error);

  await prisma.staff.create({ data: parsed.data });
  refreshAdmin();
  redirect("/admin/staff");
}

export async function updateStaff(id: string, values: StaffInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = staffSchema.safeParse(values);
  if (!parsed.success) return fromZodError(parsed.error);

  const result = await prisma.staff.updateMany({ where: { id }, data: parsed.data });
  if (result.count === 0) return { ok: false, message: "This staff member no longer exists." };

  refreshAdmin();
  redirect("/admin/staff");
}

export async function setStaffActive(id: string, active: boolean): Promise<ActionResult> {
  await requireAdmin();
  await prisma.staff.updateMany({ where: { id }, data: { active } });
  refreshAdmin();
  return { ok: true, message: active ? "Staff member activated" : "Staff member deactivated" };
}
