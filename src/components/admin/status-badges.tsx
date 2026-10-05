import { Badge } from "@/components/admin/ui/badge";
import type { MemberStatusValue, PaymentState } from "@/lib/members";
import { cn } from "@/lib/utils";

const paymentStyles: Record<PaymentState, { label: string; className: string }> = {
  PAID: { label: "Paid in full", className: "border-emerald-200 bg-emerald-50 text-emerald-800" },
  PARTIAL: { label: "Advance paid", className: "border-amber-300 bg-amber-100 text-amber-900" },
  UNPAID: { label: "Unpaid", className: "border-red-200 bg-red-50 text-red-800" },
};

export function PaymentBadge({ state, className }: { state: PaymentState; className?: string }) {
  const style = paymentStyles[state];
  return (
    <Badge variant="outline" className={cn(style.className, className)}>
      {style.label}
    </Badge>
  );
}

export function OverdueBadge() {
  return <Badge variant="destructive">Overdue</Badge>;
}

const statusStyles: Record<MemberStatusValue, { label: string; className: string }> = {
  ACTIVE: { label: "Active", className: "border-emerald-200 bg-emerald-50 text-emerald-800" },
  EXPIRED: { label: "Expired", className: "border-red-200 bg-red-50 text-red-800" },
  CANCELLED: { label: "Cancelled", className: "border-border bg-muted text-muted-foreground" },
};

export function StatusBadge({ status }: { status: MemberStatusValue }) {
  const style = statusStyles[status];
  return (
    <Badge variant="outline" className={style.className}>
      {style.label}
    </Badge>
  );
}
