import ExcelJS from "exceljs";
import { z } from "zod";
import { memberUpdateSchema, paymentSchema, staffSchema } from "@/lib/validators";
import { toDateInput } from "@/lib/dates";
import { PAYMENT_METHODS, type MemberStatusValue, type PaymentMethodValue } from "@/lib/members";

export const MEMBER_HEADERS = [
  "Name",
  "Phone",
  "Plan",
  "Plan Price",
  "Start Date",
  "End Date",
  "Balance Due By",
  "Status",
  "Notes",
  "Amount Paid",
] as const;
export const PAYMENT_HEADERS = ["Member Phone", "Amount", "Date", "Method", "Note"] as const;
export const STAFF_HEADERS = ["Name", "Role", "Phone", "Active"] as const;

export type ExportMember = {
  name: string;
  phone: string;
  plan: string;
  planPrice: number;
  startDate: Date;
  endDate: Date;
  balanceDueBy: Date | null;
  status: MemberStatusValue;
  notes: string | null;
  payments: { amount: number; paidAt: Date; method: PaymentMethodValue; note: string | null }[];
};
export type ExportStaff = { name: string; role: string; phone: string; active: boolean };

function styleHeader(sheet: ExcelJS.Worksheet) {
  const row = sheet.getRow(1);
  row.font = { bold: true };
  row.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF6A821" } };
  sheet.views = [{ state: "frozen", ySplit: 1 }];
  sheet.columns.forEach((c) => (c.width = 18));
}

export async function buildWorkbook(
  members: ExportMember[],
  staff: ExportStaff[],
  opts: { instructions?: boolean } = {}
): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Transformation Zone Gym admin";

  if (opts.instructions) {
    const info = wb.addWorksheet("Read me");
    info.columns = [{ width: 110 }];
    [
      "TRANSFORMATION ZONE GYM — import template (the rows in this file are DUMMY data).",
      "1. Delete the dummy rows, keep the header row of each sheet exactly as it is.",
      "2. Members sheet: Name, Phone, Plan, Plan Price, Start Date, End Date are required. Dates as yyyy-mm-dd (or dd/mm/yyyy).",
      "3. Status is ACTIVE, EXPIRED or CANCELLED (blank = ACTIVE). Amount Paid becomes one payment dated on the start date.",
      "4. Payments sheet (optional): one row per payment, matched to a member by Member Phone. If it has rows, Amount Paid is ignored.",
      "5. Method is CASH, UPI, CARD, BANK_TRANSFER or OTHER. Staff sheet: Active is YES or NO.",
      "6. Members/staff whose phone already exists in the system are skipped, never overwritten.",
    ].forEach((line) => info.addRow([line]));
    info.getRow(1).font = { bold: true };
  }

  const ms = wb.addWorksheet("Members");
  ms.addRow([...MEMBER_HEADERS]);
  for (const m of members) {
    ms.addRow([
      m.name,
      m.phone,
      m.plan,
      m.planPrice,
      toDateInput(m.startDate),
      toDateInput(m.endDate),
      m.balanceDueBy ? toDateInput(m.balanceDueBy) : "",
      m.status,
      m.notes ?? "",
      m.payments.reduce((s, p) => s + p.amount, 0),
    ]);
  }
  styleHeader(ms);

  const ps = wb.addWorksheet("Payments");
  ps.addRow([...PAYMENT_HEADERS]);
  for (const m of members) {
    for (const p of m.payments) {
      ps.addRow([m.phone, p.amount, toDateInput(p.paidAt), p.method, p.note ?? ""]);
    }
  }
  styleHeader(ps);

  const ss = wb.addWorksheet("Staff");
  ss.addRow([...STAFF_HEADERS]);
  for (const s of staff) ss.addRow([s.name, s.role, s.phone, s.active ? "YES" : "NO"]);
  styleHeader(ss);

  return Buffer.from(await wb.xlsx.writeBuffer());
}

export function dummyData(today: Date): { members: ExportMember[]; staff: ExportStaff[] } {
  const d = (offset: number) => new Date(today.getTime() + offset * 86_400_000);
  return {
    members: [
      {
        name: "Dummy Member One",
        phone: "9000000001",
        plan: "12 + 1 Month",
        planPrice: 10999,
        startDate: d(-30),
        endDate: d(335),
        balanceDueBy: null,
        status: "ACTIVE",
        notes: "Paid in full",
        payments: [{ amount: 10999, paidAt: d(-30), method: "UPI", note: "" }],
      },
      {
        name: "Dummy Member Two",
        phone: "9000000002",
        plan: "1 Month + 1 Month Personal Training",
        planPrice: 7999,
        startDate: d(-3),
        endDate: d(27),
        balanceDueBy: d(10),
        status: "ACTIVE",
        notes: "Advance paid, balance later",
        payments: [{ amount: 2000, paidAt: d(-3), method: "CASH", note: "Advance" }],
      },
      {
        name: "Dummy Member Three",
        phone: "9000000003",
        plan: "12 Month + 1 Month Personal Training",
        planPrice: 14999,
        startDate: d(-400),
        endDate: d(-35),
        balanceDueBy: null,
        status: "EXPIRED",
        notes: "",
        payments: [{ amount: 14999, paidAt: d(-400), method: "CARD", note: "" }],
      },
    ],
    staff: [
      { name: "Dummy Trainer", role: "Trainer", phone: "9000000101", active: true },
      { name: "Dummy Front Desk", role: "Front desk", phone: "9000000102", active: true },
    ],
  };
}

// ---------- import ----------

type Row = Record<string, string>;

function cellText(value: ExcelJS.CellValue): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return toDateInput(value);
  if (typeof value === "object") {
    if ("result" in value && value.result !== undefined) return cellText(value.result as ExcelJS.CellValue);
    if ("richText" in value) return value.richText.map((r) => r.text).join("").trim();
    if ("text" in value) return String(value.text).trim();
    return "";
  }
  return String(value).trim();
}

function normalizeDate(text: string): string {
  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(text);
  if (iso) return `${iso[1]}-${iso[2].padStart(2, "0")}-${iso[3].padStart(2, "0")}`;
  const dmy = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/.exec(text);
  if (dmy) return `${dmy[3]}-${dmy[2].padStart(2, "0")}-${dmy[1].padStart(2, "0")}`;
  return text;
}

function readSheet(wb: ExcelJS.Workbook, name: string, headers: readonly string[]): { rows: Row[]; rowNumbers: number[] } {
  const sheet = wb.getWorksheet(name);
  const rows: Row[] = [];
  const rowNumbers: number[] = [];
  if (!sheet) return { rows, rowNumbers };
  const headerRow = sheet.getRow(1);
  const index: Record<string, number> = {};
  headerRow.eachCell((cell, col) => {
    const label = cellText(cell.value).toLowerCase();
    const match = headers.find((h) => h.toLowerCase() === label);
    if (match) index[match] = col;
  });
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const out: Row = {};
    let any = false;
    for (const h of headers) {
      const text = index[h] ? cellText(row.getCell(index[h]).value) : "";
      out[h] = text;
      if (text) any = true;
    }
    if (any) {
      rows.push(out);
      rowNumbers.push(rowNumber);
    }
  });
  return { rows, rowNumbers };
}

export type ParsedImport = {
  members: {
    row: number;
    data: z.output<typeof memberUpdateSchema>;
    status: MemberStatusValue;
    amountPaid: number;
  }[];
  payments: { row: number; phone: string; data: z.output<typeof paymentSchema> }[];
  staff: { row: number; data: z.output<typeof staffSchema>; active: boolean }[];
  errors: string[];
};

export const digits = (phone: string) => phone.replace(/\D/g, "");

export async function parseWorkbook(buffer: ArrayBuffer): Promise<ParsedImport> {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buffer);
  const result: ParsedImport = { members: [], payments: [], staff: [], errors: [] };
  const fail = (sheet: string, row: number, message: string) =>
    result.errors.push(`${sheet} row ${row}: ${message}`);

  const members = readSheet(wb, "Members", MEMBER_HEADERS);
  members.rows.forEach((r, i) => {
    const row = members.rowNumbers[i];
    const parsed = memberUpdateSchema.safeParse({
      name: r["Name"],
      phone: r["Phone"],
      plan: r["Plan"],
      planPrice: r["Plan Price"],
      startDate: normalizeDate(r["Start Date"]),
      endDate: normalizeDate(r["End Date"]),
      balanceDueBy: normalizeDate(r["Balance Due By"]),
      notes: r["Notes"],
    });
    if (!parsed.success) return fail("Members", row, parsed.error.issues[0].message);
    const status = (r["Status"] || "ACTIVE").toUpperCase();
    if (!["ACTIVE", "EXPIRED", "CANCELLED"].includes(status))
      return fail("Members", row, `Status "${r["Status"]}" must be ACTIVE, EXPIRED or CANCELLED`);
    const paid = Number((r["Amount Paid"] || "0").replace(/[,\s₹]/g, ""));
    if (!Number.isFinite(paid) || paid < 0) return fail("Members", row, "Amount Paid must be a number");
    result.members.push({ row, data: parsed.data, status: status as MemberStatusValue, amountPaid: paid });
  });

  const payments = readSheet(wb, "Payments", PAYMENT_HEADERS);
  payments.rows.forEach((r, i) => {
    const row = payments.rowNumbers[i];
    const method = (r["Method"] || "CASH").toUpperCase().replace(/\s+/g, "_");
    const parsed = paymentSchema.safeParse({
      amount: r["Amount"],
      paidAt: normalizeDate(r["Date"]),
      method: PAYMENT_METHODS.some((m) => m.value === method) ? method : "OTHER",
      note: r["Note"],
    });
    if (!parsed.success) return fail("Payments", row, parsed.error.issues[0].message);
    if (!digits(r["Member Phone"])) return fail("Payments", row, "Member Phone is required");
    result.payments.push({ row, phone: digits(r["Member Phone"]), data: parsed.data });
  });

  const staff = readSheet(wb, "Staff", STAFF_HEADERS);
  staff.rows.forEach((r, i) => {
    const row = staff.rowNumbers[i];
    const parsed = staffSchema.safeParse({ name: r["Name"], role: r["Role"], phone: r["Phone"] });
    if (!parsed.success) return fail("Staff", row, parsed.error.issues[0].message);
    result.staff.push({ row, data: parsed.data, active: !/^(no|false|0|inactive)$/i.test(r["Active"]) });
  });

  return result;
}

export function backupFileName(now: Date): string {
  return `tz-gym-backup-${toDateInput(now)}.xlsx`;
}
