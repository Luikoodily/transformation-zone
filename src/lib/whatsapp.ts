import { location } from "@/data/location";
import { formatDate } from "@/lib/dates";
import { formatINR } from "@/lib/format";

/** Digits only, with India's +91 prefixed to bare 10-digit numbers. */
export function toWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "").replace(/^0+/, "");
  return digits.length === 10 ? `91${digits}` : digits;
}

export function whatsappLinkTo(phone: string, message: string): string {
  return `https://wa.me/${toWhatsAppNumber(phone)}?text=${encodeURIComponent(message)}`;
}

export function dueReminderLink(member: {
  name: string;
  phone: string;
  plan: string;
  balance: number;
  balanceDueBy: Date | null;
}): string {
  const dueBy = member.balanceDueBy ? ` by ${formatDate(member.balanceDueBy)}` : "";
  return whatsappLinkTo(
    member.phone,
    `Hi ${member.name}, a gentle reminder from ${location.name}: ${formatINR(member.balance)} is pending for your ${member.plan} membership${dueBy}. Thank you!`
  );
}
