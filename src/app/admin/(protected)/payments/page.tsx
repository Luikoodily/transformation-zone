import Link from "next/link";
import { BanknoteIcon, ChevronLeftIcon, ChevronRightIcon, ReceiptIcon } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { Button } from "@/components/admin/ui/button";
import { Card, CardContent } from "@/components/admin/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/admin/ui/table";
import { addMonths, formatDate, formatMonth, monthKey, monthRange, todayUTC } from "@/lib/dates";
import { formatINR } from "@/lib/format";
import { PAYMENT_METHODS, paymentMethodLabel } from "@/lib/members";
import { prisma } from "@/lib/prisma";

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month } = await searchParams;
  const today = todayUTC();
  const currentKey = monthKey(today);
  const range = monthRange(month ?? currentKey) ?? monthRange(currentKey)!;
  const activeKey = monthKey(range.start);

  const payments = await prisma.payment.findMany({
    where: { paidAt: { gte: range.start, lt: range.end } },
    orderBy: [{ paidAt: "desc" }, { createdAt: "desc" }],
    include: { member: { select: { id: true, name: true } } },
  });

  const total = payments.reduce((sum, p) => sum + p.amount, 0);
  const byMethod = PAYMENT_METHODS.map((m) => ({
    ...m,
    amount: payments.filter((p) => p.method === m.value).reduce((sum, p) => sum + p.amount, 0),
  })).filter((m) => m.amount > 0);

  const prevKey = monthKey(addMonths(range.start, -1));
  const nextKey = monthKey(addMonths(range.start, 1));
  const canGoNext = nextKey <= currentKey;

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Payments"
        description="Every rupee received, month by month."
        actions={
          <div className="flex items-center gap-1 rounded-lg border bg-card p-1">
            <Button asChild variant="ghost" size="icon-sm">
              <Link href={`/admin/payments?month=${prevKey}`} aria-label="Previous month">
                <ChevronLeftIcon />
              </Link>
            </Button>
            <span className="min-w-32 px-2 text-center text-sm font-medium">{formatMonth(range.start)}</span>
            {canGoNext ? (
              <Button asChild variant="ghost" size="icon-sm">
                <Link href={`/admin/payments?month=${nextKey}`} aria-label="Next month">
                  <ChevronRightIcon />
                </Link>
              </Button>
            ) : (
              <Button variant="ghost" size="icon-sm" disabled aria-label="Next month">
                <ChevronRightIcon />
              </Button>
            )}
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Collected" value={formatINR(total)} icon={BanknoteIcon} hint={formatMonth(range.start)} />
        <StatCard
          label="Payments"
          value={payments.length}
          icon={ReceiptIcon}
          hint={activeKey === currentKey ? "So far this month" : "In this month"}
        />
        <Card className="gap-2 py-5">
          <CardContent className="grid gap-2">
            <p className="text-sm text-muted-foreground">By method</p>
            {byMethod.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing collected.</p>
            ) : (
              <ul className="grid gap-1 text-sm">
                {byMethod.map((m) => (
                  <li key={m.value} className="flex items-center justify-between">
                    <span>{m.label}</span>
                    <span className="font-medium">{formatINR(m.amount)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="py-0">
        <CardContent className="p-0">
          {payments.length === 0 ? (
            <EmptyState
              title="No payments this month"
              description="Payments are recorded from each member's page."
              action={
                <Button asChild variant="outline">
                  <Link href="/admin/members">Go to members</Link>
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="pl-4">Date</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead className="pr-4 text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="pl-4">{formatDate(payment.paidAt)}</TableCell>
                    <TableCell>
                      <Link href={`/admin/members/${payment.member.id}`} className="font-medium hover:underline">
                        {payment.member.name}
                      </Link>
                    </TableCell>
                    <TableCell>{paymentMethodLabel(payment.method)}</TableCell>
                    <TableCell className="max-w-56 whitespace-normal text-muted-foreground">
                      {payment.note ?? "—"}
                    </TableCell>
                    <TableCell className="pr-4 text-right font-medium">{formatINR(payment.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4} className="pl-4 font-medium">
                    Total
                  </TableCell>
                  <TableCell className="pr-4 text-right font-medium">{formatINR(total)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
