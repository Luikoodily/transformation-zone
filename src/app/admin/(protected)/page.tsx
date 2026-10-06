import Link from "next/link";
import {
  BanknoteIcon,
  CalendarClockIcon,
  HandCoinsIcon,
  MessageCircleIcon,
  UserCogIcon,
  UsersIcon,
} from "lucide-react";
import { OverdueBadge, PaymentBadge } from "@/components/admin/status-badges";
import { PageHeader, EmptyState } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { Button } from "@/components/admin/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Progress } from "@/components/admin/ui/progress";
import { addMonths, daysBetween, formatDate, todayUTC } from "@/lib/dates";
import { formatINR } from "@/lib/format";
import { matchesFilter, paymentMethodLabel, summarizeMember } from "@/lib/members";
import { prisma } from "@/lib/prisma";
import { BackupStatus } from "@/components/admin/data-tools";
import { dueReminderLink, renewalReminderLink } from "@/lib/whatsapp";

function relativeDays(daysLeft: number): string {
  if (daysLeft === 0) return "today";
  if (daysLeft === 1) return "tomorrow";
  return `in ${daysLeft} days`;
}

export default async function AdminHome() {
  const today = todayUTC();
  const monthStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
  const nextMonthStart = addMonths(monthStart, 1);

  const [members, activeStaff, monthPayments, recentPayments] = await Promise.all([
    prisma.member.findMany({
      where: { status: { not: "CANCELLED" } },
      include: { payments: { select: { amount: true } } },
    }),
    prisma.staff.count({ where: { active: true } }),
    prisma.payment.aggregate({
      where: { paidAt: { gte: monthStart, lt: nextMonthStart } },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.payment.findMany({
      orderBy: [{ paidAt: "desc" }, { createdAt: "desc" }],
      take: 6,
      include: { member: { select: { id: true, name: true } } },
    }),
  ]);

  const rows = members.map((member) => ({ member, summary: summarizeMember(member, today) }));
  const activeCount = rows.filter((r) => r.summary.effectiveStatus === "ACTIVE").length;
  const expiring = rows
    .filter((r) => matchesFilter(r.summary, "expiring"))
    .sort((a, b) => a.summary.daysLeft - b.summary.daysLeft);
  const dues = rows
    .filter((r) => r.summary.balance > 0)
    .sort((a, b) => {
      if (a.summary.overdue !== b.summary.overdue) return a.summary.overdue ? -1 : 1;
      const aDue = a.member.balanceDueBy?.getTime() ?? Number.MAX_SAFE_INTEGER;
      const bDue = b.member.balanceDueBy?.getTime() ?? Number.MAX_SAFE_INTEGER;
      if (aDue !== bDue) return aDue - bDue;
      return b.summary.balance - a.summary.balance;
    });
  const totalDue = dues.reduce((sum, r) => sum + r.summary.balance, 0);
  const overdueCount = dues.filter((r) => r.summary.overdue).length;

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Dashboard"
        description={`Today is ${formatDate(today)}. Here's how the gym is doing.`}
        actions={
          <Button asChild>
            <Link href="/admin/members/new">Add member</Link>
          </Button>
        }
      />

      <BackupStatus />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Active members" value={activeCount} icon={UsersIcon} hint="Membership running today" />
        <StatCard
          label="Expiring in 7 days"
          value={expiring.length}
          icon={CalendarClockIcon}
          tone={expiring.length > 0 ? "warning" : "default"}
          hint="Time to nudge a renewal"
        />
        <StatCard
          label="Pending dues"
          value={formatINR(totalDue)}
          icon={HandCoinsIcon}
          tone={overdueCount > 0 ? "danger" : totalDue > 0 ? "warning" : "default"}
          hint={
            dues.length === 0
              ? "Everyone is paid up"
              : `${dues.length} member${dues.length === 1 ? "" : "s"}${overdueCount > 0 ? ` · ${overdueCount} overdue` : ""}`
          }
        />
        <StatCard
          label="Collected this month"
          value={formatINR(monthPayments._sum.amount ?? 0)}
          icon={BanknoteIcon}
          hint={`${monthPayments._count} payment${monthPayments._count === 1 ? "" : "s"}`}
        />
        <StatCard label="Active staff" value={activeStaff} icon={UserCogIcon} />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Payments due</CardTitle>
            <CardDescription>Advances and part-payments with a balance still to collect.</CardDescription>
          </CardHeader>
          <CardContent>
            {dues.length === 0 ? (
              <EmptyState title="No pending balances" description="When a member pays only an advance, the remaining amount shows up here." />
            ) : (
              <ul className="divide-y">
                {dues.slice(0, 6).map(({ member, summary }) => (
                  <li key={member.id} className="grid gap-3 py-3 first:pt-0 last:pb-0 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link href={`/admin/members/${member.id}`} className="font-medium hover:underline">
                          {member.name}
                        </Link>
                        <PaymentBadge state={summary.paymentState} />
                        {summary.overdue && <OverdueBadge />}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {member.plan} · {formatINR(summary.paid)} of {formatINR(member.planPrice)} paid
                        {member.balanceDueBy ? ` · due ${formatDate(member.balanceDueBy)}` : ""}
                      </p>
                      <Progress value={summary.percent} className="mt-2 h-1.5" />
                    </div>
                    <div className="flex items-center gap-2 sm:justify-end">
                      <span className="font-display text-2xl leading-none">{formatINR(summary.balance)}</span>
                      <Button asChild size="icon-sm" variant="outline">
                        <a
                          href={dueReminderLink({
                            name: member.name,
                            phone: member.phone,
                            plan: member.plan,
                            balance: summary.balance,
                            balanceDueBy: member.balanceDueBy,
                          })}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Send WhatsApp reminder to ${member.name}`}
                          title="Send WhatsApp reminder"
                        >
                          <MessageCircleIcon />
                        </a>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {dues.length > 6 && (
              <Button asChild variant="link" className="mt-3 px-0">
                <Link href="/admin/members?filter=due">View all {dues.length} dues →</Link>
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="grid content-start gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Expiring soon</CardTitle>
              <CardDescription>Memberships ending within a week.</CardDescription>
            </CardHeader>
            <CardContent>
              {expiring.length === 0 ? (
                <EmptyState title="Nothing expiring this week" />
              ) : (
                <ul className="divide-y">
                  {expiring.map(({ member, summary }) => (
                    <li key={member.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                      <Link href={`/admin/members/${member.id}`} className="min-w-0 truncate font-medium hover:underline">
                        {member.name}
                      </Link>
                      <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                        {formatDate(member.endDate)} · {relativeDays(summary.daysLeft)}
                        <Button asChild size="icon-xs" variant="outline">
                          <a
                            href={renewalReminderLink({ name: member.name, phone: member.phone, plan: member.plan, endDate: member.endDate })}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Send renewal reminder to ${member.name}`}
                            title="Send renewal reminder on WhatsApp"
                          >
                            <MessageCircleIcon />
                          </a>
                        </Button>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent payments</CardTitle>
              <CardDescription>The last few entries in the ledger.</CardDescription>
            </CardHeader>
            <CardContent>
              {recentPayments.length === 0 ? (
                <EmptyState title="No payments yet" />
              ) : (
                <ul className="divide-y">
                  {recentPayments.map((payment) => (
                    <li key={payment.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                      <div className="min-w-0">
                        <Link href={`/admin/members/${payment.member.id}`} className="block truncate font-medium hover:underline">
                          {payment.member.name}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(payment.paidAt)} · {paymentMethodLabel(payment.method)}
                          {daysBetween(payment.paidAt, today) === 0 ? " · today" : ""}
                        </p>
                      </div>
                      <span className="shrink-0 font-medium">{formatINR(payment.amount)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
