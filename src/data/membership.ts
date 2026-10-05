// Real pricing — sourced from the gym's own flyer artwork. Confirm before any
// price change goes live; this is the number customers will hold you to.
//
// `months` is the suggested membership length the admin dashboard pre-fills as
// the end date when a plan is picked. It is a reading of the flyer wording
// ("12 + 1" = 12 months + 1 bonus month, the couple offer = 12 months each,
// personal-training add-ons run alongside the membership) and is always
// editable per member.
import { formatINR } from "@/lib/format";

export type MembershipPlan = {
  title: string;
  /** Whole rupees. */
  amount: number;
  months: number;
  note?: string;
};

export const membershipPlans: MembershipPlan[] = [
  { title: "12 + 1 Month", amount: 10999, months: 13 },
  { title: "12 + 12 Month", amount: 18500, months: 12, note: "Couple" },
  { title: "12 Month + 1 Month Personal Training", amount: 14999, months: 12 },
  { title: "1 Month + 1 Month Personal Training", amount: 7999, months: 1 },
];

export function planLabel(plan: MembershipPlan): string {
  return plan.note ? `${plan.title} (${plan.note})` : plan.title;
}

export function planPriceLabel(plan: MembershipPlan): string {
  return formatINR(plan.amount);
}

export const membershipServicesNote =
  "Strength / Cardio / Yoga / Zumba / Personal Training";
