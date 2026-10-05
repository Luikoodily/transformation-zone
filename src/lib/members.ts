import { daysBetween } from "@/lib/dates";

export type MemberStatusValue = "ACTIVE" | "EXPIRED" | "CANCELLED";
export type PaymentState = "UNPAID" | "PARTIAL" | "PAID";
export type PaymentMethodValue = "CASH" | "UPI" | "CARD" | "BANK_TRANSFER" | "OTHER";

export const PAYMENT_METHODS: { value: PaymentMethodValue; label: string }[] = [
  { value: "CASH", label: "Cash" },
  { value: "UPI", label: "UPI" },
  { value: "CARD", label: "Card" },
  { value: "BANK_TRANSFER", label: "Bank transfer" },
  { value: "OTHER", label: "Other" },
];

export function paymentMethodLabel(method: PaymentMethodValue): string {
  return PAYMENT_METHODS.find((m) => m.value === method)?.label ?? method;
}

export type MemberForSummary = {
  status: MemberStatusValue;
  endDate: Date;
  planPrice: number;
  balanceDueBy: Date | null;
  payments: { amount: number }[];
};

export type MemberSummary = {
  paid: number;
  balance: number;
  percent: number;
  paymentState: PaymentState;
  daysLeft: number;
  effectiveStatus: MemberStatusValue;
  overdue: boolean;
};

/**
 * Everything the admin needs to know about a member's money and membership.
 * The stored status is only a manual override: an ACTIVE member whose end date
 * has passed is treated as EXPIRED without anyone having to flip a switch.
 */
export function summarizeMember(member: MemberForSummary, today: Date): MemberSummary {
  const paid = member.payments.reduce((sum, p) => sum + p.amount, 0);
  const balance = Math.max(member.planPrice - paid, 0);
  const paymentState: PaymentState = balance === 0 ? "PAID" : paid > 0 ? "PARTIAL" : "UNPAID";
  const percent =
    member.planPrice > 0 ? Math.min(100, Math.round((paid / member.planPrice) * 100)) : 100;

  const daysLeft = daysBetween(today, member.endDate);
  const effectiveStatus: MemberStatusValue =
    member.status === "CANCELLED"
      ? "CANCELLED"
      : member.status === "EXPIRED" || daysLeft < 0
        ? "EXPIRED"
        : "ACTIVE";

  const overdue =
    balance > 0 &&
    member.status !== "CANCELLED" &&
    member.balanceDueBy !== null &&
    daysBetween(today, member.balanceDueBy) < 0;

  return { paid, balance, percent, paymentState, daysLeft, effectiveStatus, overdue };
}

export const MEMBER_FILTERS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "expiring", label: "Expiring soon" },
  { value: "due", label: "Payment due" },
  { value: "expired", label: "Expired" },
] as const;

export type MemberFilter = (typeof MEMBER_FILTERS)[number]["value"];

export function parseMemberFilter(value: string | undefined): MemberFilter {
  return MEMBER_FILTERS.some((f) => f.value === value) ? (value as MemberFilter) : "all";
}

export const EXPIRING_WINDOW_DAYS = 7;

export function matchesFilter(summary: MemberSummary, filter: MemberFilter): boolean {
  switch (filter) {
    case "active":
      return summary.effectiveStatus === "ACTIVE";
    case "expiring":
      return summary.effectiveStatus === "ACTIVE" && summary.daysLeft <= EXPIRING_WINDOW_DAYS;
    case "due":
      return summary.effectiveStatus !== "CANCELLED" && summary.balance > 0;
    case "expired":
      return summary.effectiveStatus === "EXPIRED";
    default:
      return true;
  }
}
