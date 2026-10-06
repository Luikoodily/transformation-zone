import { z } from "zod";

// Forms send plain strings; these schemas are the single place they are
// checked and converted (rupees -> numbers). Server Actions are public
// endpoints, so every action re-validates with these.

const dateInput = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, { error: "Pick a date" })
  .refine((value) => !Number.isNaN(Date.parse(`${value}T00:00:00Z`)), {
    error: "Pick a valid date",
  });

const optionalDateInput = z.union([z.literal(""), dateInput]);

const rupees = (label: string) =>
  z
    .string()
    .transform((value) => value.replace(/[,\s₹]/g, ""))
    .pipe(
      z
        .string()
        .regex(/^\d+$/, { error: `${label}: enter whole rupees, digits only` })
        .transform(Number)
        .pipe(z.number().max(10_000_000, { error: `${label} is too large` }))
    );

const optionalRupees = (label: string) =>
  z
    .string()
    .transform((value) => value.trim())
    .pipe(z.union([z.literal("").transform(() => 0), rupees(label)]));

const paymentMethod = z.enum(["CASH", "UPI", "CARD", "BANK_TRANSFER", "OTHER"], {
  error: "Choose how it was paid",
});

const phone = z
  .string()
  .trim()
  .min(7, { error: "Enter a valid phone number" })
  .max(20, { error: "Phone number is too long" })
  .regex(/^[\d+\-\s()]+$/, { error: "Use digits, spaces, + or - only" });

const memberFields = {
  name: z.string().trim().min(1, { error: "Name is required" }).max(80, { error: "Name is too long" }),
  phone,
  plan: z.string().trim().min(1, { error: "Choose or type a plan" }).max(100, { error: "Plan name is too long" }),
  planPrice: rupees("Plan price"),
  startDate: dateInput,
  endDate: dateInput,
  balanceDueBy: optionalDateInput,
  notes: z.string().trim().max(500, { error: "Notes are too long" }),
};

const endAfterStart = {
  path: ["endDate"],
  error: "End date must be on or after the start date",
};

export const memberUpdateSchema = z
  .object(memberFields)
  .refine((v) => v.endDate >= v.startDate, endAfterStart);

export const memberCreateSchema = z
  .object({
    ...memberFields,
    paymentAmount: optionalRupees("Advance"),
    paymentMethod,
    paymentDate: dateInput,
  })
  .refine((v) => v.endDate >= v.startDate, endAfterStart)
  .refine((v) => v.paymentAmount <= v.planPrice, {
    path: ["paymentAmount"],
    error: "Advance can't be more than the plan price",
  });

export const paymentSchema = z.object({
  amount: rupees("Amount").pipe(z.number().min(1, { error: "Amount must be at least ₹1" })),
  paidAt: dateInput,
  method: paymentMethod,
  note: z.string().trim().max(200, { error: "Note is too long" }),
});

export const staffSchema = z.object({
  name: z.string().trim().min(1, { error: "Name is required" }).max(80, { error: "Name is too long" }),
  role: z.string().trim().min(1, { error: "Role is required" }).max(60, { error: "Role is too long" }),
  phone,
});

export const memberStatusSchema = z.enum(["ACTIVE", "EXPIRED", "CANCELLED"]);

export type MemberUpdateInput = z.input<typeof memberUpdateSchema>;
export type MemberCreateInput = z.input<typeof memberCreateSchema>;
export type PaymentInput = z.input<typeof paymentSchema>;
export type StaffInput = z.input<typeof staffSchema>;

const optionalUrl = z.union([
  z.literal(""),
  z.url({ protocol: /^https?$/, error: "Enter a full link starting with https://" }),
]);

export const announcementSchema = z
  .object({
    kind: z.enum(["HOLIDAY", "EVENT", "NOTICE", "INSTAGRAM"], { error: "Choose a type" }),
    title: z.string().trim().min(1, { error: "Title is required" }).max(100, { error: "Title is too long" }),
    body: z.string().trim().max(600, { error: "Details are too long" }),
    startsOn: dateInput,
    endsOn: optionalDateInput,
    link: optionalUrl,
    imageUrl: optionalUrl,
    published: z.boolean(),
  })
  .refine((v) => v.endsOn === "" || v.endsOn >= v.startsOn, {
    path: ["endsOn"],
    error: "End date must be on or after the start date",
  });

export type AnnouncementInput = z.input<typeof announcementSchema>;

export const planSchema = z.object({
  title: z.string().trim().min(1, { error: "Title is required" }).max(100, { error: "Title is too long" }),
  amount: rupees("Price"),
  months: z.coerce.number().int().min(1, { error: "Months must be at least 1" }).max(60, { error: "Months is too large" }),
  note: z.string().trim().max(40, { error: "Note is too long" }),
  active: z.boolean(),
});

export type PlanInput = z.input<typeof planSchema>;
