import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { parseDateInput } from "@/lib/dates";
import { digits, parseWorkbook } from "@/lib/excel";
import { prisma } from "@/lib/prisma";

const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(request: Request) {
  if (!(await auth())?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return Response.json({ error: "Choose an .xlsx file." }, { status: 400 });
  if (!file.name.toLowerCase().endsWith(".xlsx")) {
    return Response.json({ error: "Only .xlsx files are supported." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) return Response.json({ error: "File is larger than 5 MB." }, { status: 400 });

  let parsed;
  try {
    parsed = await parseWorkbook(await file.arrayBuffer());
  } catch {
    return Response.json({ error: "Could not read this file. Is it a valid .xlsx?" }, { status: 400 });
  }

  const [existingMembers, existingStaff] = await Promise.all([
    prisma.member.findMany({ select: { id: true, phone: true } }),
    prisma.staff.findMany({ select: { phone: true } }),
  ]);
  const memberIdByPhone = new Map(existingMembers.map((m) => [digits(m.phone), m.id]));
  const staffPhones = new Set(existingStaff.map((s) => digits(s.phone)));

  const hasPaymentSheet = parsed.payments.length > 0;
  const result = { membersAdded: 0, membersSkipped: 0, paymentsAdded: 0, staffAdded: 0, staffSkipped: 0 };
  const errors = [...parsed.errors];

  const addedKeys = new Set<string>();
  for (const m of parsed.members) {
    const key = digits(m.data.phone);
    if (memberIdByPhone.has(key)) {
      result.membersSkipped++;
      continue;
    }
    const created = await prisma.member.create({
      data: {
        name: m.data.name,
        phone: m.data.phone,
        plan: m.data.plan,
        planPrice: m.data.planPrice,
        startDate: parseDateInput(m.data.startDate),
        endDate: parseDateInput(m.data.endDate),
        balanceDueBy: m.data.balanceDueBy ? parseDateInput(m.data.balanceDueBy) : null,
        notes: m.data.notes || null,
        status: m.status,
        payments:
          !hasPaymentSheet && m.amountPaid > 0
            ? { create: { amount: m.amountPaid, paidAt: parseDateInput(m.data.startDate), method: "CASH", note: "Imported" } }
            : undefined,
      },
    });
    memberIdByPhone.set(key, created.id);
    addedKeys.add(key);
    result.membersAdded++;
    if (!hasPaymentSheet && m.amountPaid > 0) result.paymentsAdded++;
  }

  // Payments are only attached to members created in this import, so
  // re-importing a backup over existing members never duplicates their money.
  for (const p of parsed.payments) {
    const memberId = memberIdByPhone.get(p.phone);
    if (!memberId) {
      errors.push(`Payments row ${p.row}: no member with phone ${p.phone}`);
      continue;
    }
    if (!addedKeys.has(p.phone)) continue;
    await prisma.payment.create({
      data: {
        memberId,
        amount: p.data.amount,
        paidAt: parseDateInput(p.data.paidAt),
        method: p.data.method,
        note: p.data.note || null,
      },
    });
    result.paymentsAdded++;
  }

  for (const s of parsed.staff) {
    const key = digits(s.data.phone);
    if (staffPhones.has(key)) {
      result.staffSkipped++;
      continue;
    }
    await prisma.staff.create({ data: { ...s.data, active: s.active } });
    staffPhones.add(key);
    result.staffAdded++;
  }

  revalidatePath("/admin", "layout");
  return Response.json({ ...result, errors });
}
