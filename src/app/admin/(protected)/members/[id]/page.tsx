import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, Trash2Icon } from "lucide-react";
import { ConfirmActionButton } from "@/components/admin/confirm-action-button";
import { MemberForm } from "@/components/admin/member-form";
import { MemberStatusActions } from "@/components/admin/member-status-actions";
import { EmptyState, PageHeader } from "@/components/admin/page-header";
import { RecordPaymentForm } from "@/components/admin/record-payment-form";
import { OverdueBadge, PaymentBadge, StatusBadge } from "@/components/admin/status-badges";
import { Button } from "@/components/admin/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Progress } from "@/components/admin/ui/progress";
import { Separator } from "@/components/admin/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/admin/ui/table";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { formatDate, toDateInput, todayUTC } from "@/lib/dates";
import { formatINR } from "@/lib/format";
import { paymentMethodLabel, summarizeMember } from "@/lib/members";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { dueReminderLink, whatsappLinkTo } from "@/lib/whatsapp";
import { deleteMember, deletePayment, recordPayment, setMemberStatus, updateMember } from "../actions";

function MiniStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "warning" | "success";
}) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-muted/50 px-3 py-2.5",
        tone === "warning" && "border-amber-300 bg-amber-50",
        tone === "success" && "border-emerald-200 bg-emerald-50"
      )}
    >
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-display text-2xl leading-tight">{value}</p>
    </div>
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-2 py-2 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 break-words">{children}</dd>
    </div>
  );
}

export default async function MemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = await prisma.member.findUnique({
    where: { id },
    include: { payments: { orderBy: [{ paidAt: "desc" }, { createdAt: "desc" }] } },
  });
  if (!member) notFound();

  const today = todayUTC();
  const summary = summarizeMember(member, today);
  const todayInput = toDateInput(today);
  const reminder = dueReminderLink({
    name: member.name,
    phone: member.phone,
    plan: member.plan,
    balance: summary.balance,
    balanceDueBy: member.balanceDueBy,
  });

  const paymentDescription =
    summary.paymentState === "PAID"
      ? "Paid in full."
      : summary.paymentState === "PARTIAL"
        ? "Advance received — the balance is still to be collected."
        : "No payment received yet.";

  return (
    <div className="grid gap-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-2">
          <Link href="/admin/members">
            <ArrowLeftIcon />
            Members
          </Link>
        </Button>
        <PageHeader
          title={member.name}
          description={`${member.phone} · ${member.plan}`}
          actions={
            <>
              <StatusBadge status={summary.effectiveStatus} />
              <PaymentBadge state={summary.paymentState} />
              {summary.overdue && <OverdueBadge />}
              <Button asChild variant="outline" size="sm">
                <a href={whatsappLinkTo(member.phone, `Hi ${member.name},`)} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="size-4" />
                  WhatsApp
                </a>
              </Button>
              {summary.balance > 0 && (
                <Button asChild size="sm">
                  <a href={reminder} target="_blank" rel="noopener noreferrer">
                    Send due reminder
                  </a>
                </Button>
              )}
            </>
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Payments</CardTitle>
            <CardDescription>{paymentDescription}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="grid grid-cols-3 gap-3">
              <MiniStat label="Paid" value={formatINR(summary.paid)} tone={summary.balance === 0 ? "success" : undefined} />
              <MiniStat label="Plan price" value={formatINR(member.planPrice)} />
              <MiniStat
                label="Balance due"
                value={formatINR(summary.balance)}
                tone={summary.balance > 0 ? "warning" : "success"}
              />
            </div>
            <div className="grid gap-1.5">
              <Progress value={summary.percent} className="h-2.5" />
              <p className="text-xs text-muted-foreground">
                {summary.percent}% paid
                {summary.balance > 0 && member.balanceDueBy
                  ? ` · balance expected by ${formatDate(member.balanceDueBy)}${summary.overdue ? " (overdue)" : ""}`
                  : ""}
              </p>
            </div>

            <Separator />

            <div className="grid gap-3">
              <h3 className="text-sm font-medium">Record a payment</h3>
              <RecordPaymentForm
                balance={summary.balance}
                today={todayInput}
                onSubmit={recordPayment.bind(null, member.id)}
              />
            </div>

            <Separator />

            <div className="grid gap-3">
              <h3 className="text-sm font-medium">Payment history</h3>
              {member.payments.length === 0 ? (
                <EmptyState title="No payments recorded" description="Payments you record above will be listed here." />
              ) : (
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="pl-3">Date</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Note</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="w-10 pr-3" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {member.payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="pl-3">{formatDate(payment.paidAt)}</TableCell>
                          <TableCell>{paymentMethodLabel(payment.method)}</TableCell>
                          <TableCell className="max-w-40 whitespace-normal text-muted-foreground">
                            {payment.note ?? "—"}
                          </TableCell>
                          <TableCell className="text-right font-medium">{formatINR(payment.amount)}</TableCell>
                          <TableCell className="pr-3">
                            <ConfirmActionButton
                              trigger={
                                <Button variant="ghost" size="icon-sm" aria-label="Delete payment">
                                  <Trash2Icon />
                                </Button>
                              }
                              title="Delete this payment?"
                              description={`Removes the ${formatINR(payment.amount)} payment from ${formatDate(payment.paidAt)}. The balance due will go back up by that amount.`}
                              confirmLabel="Delete payment"
                              action={deletePayment.bind(null, payment.id)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid content-start gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Membership</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="divide-y">
                <Fact label="Plan">{member.plan}</Fact>
                <Fact label="Starts">{formatDate(member.startDate)}</Fact>
                <Fact label="Ends">
                  {formatDate(member.endDate)}
                  <span className="block text-xs text-muted-foreground">
                    {summary.effectiveStatus === "ACTIVE"
                      ? summary.daysLeft === 0
                        ? "Ends today"
                        : `${summary.daysLeft} day${summary.daysLeft === 1 ? "" : "s"} left`
                      : summary.effectiveStatus === "EXPIRED"
                        ? "Membership has ended"
                        : "Cancelled"}
                  </span>
                </Fact>
                <Fact label="Balance due by">
                  {member.balanceDueBy ? formatDate(member.balanceDueBy) : <span className="text-muted-foreground">Not set</span>}
                </Fact>
                <Fact label="Notes">
                  {member.notes ? member.notes : <span className="text-muted-foreground">None</span>}
                </Fact>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
              <CardDescription>
                Active memberships are marked Expired automatically once the end date passes. Use this to override.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <MemberStatusActions current={member.status} onSelect={setMemberStatus.bind(null, member.id)} />
              <Separator />
              <div className="grid gap-2">
                <p className="text-xs text-muted-foreground">
                  Deleting also removes this member&rsquo;s payment history. To keep the records, mark them Cancelled instead.
                </p>
                <ConfirmActionButton
                  trigger={
                    <Button variant="outline" size="sm" className="w-fit border-destructive/40 text-destructive hover:text-destructive">
                      <Trash2Icon />
                      Delete member
                    </Button>
                  }
                  title={`Delete ${member.name}?`}
                  description={
                    member.payments.length > 0
                      ? `This permanently deletes ${member.name} and ${member.payments.length} payment record${member.payments.length === 1 ? "" : "s"} totalling ${formatINR(summary.paid)}. This can't be undone.`
                      : `This permanently deletes ${member.name}. This can't be undone.`
                  }
                  confirmLabel="Delete member"
                  action={deleteMember.bind(null, member.id)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <section className="grid max-w-3xl gap-4">
        <h2 className="font-display text-2xl tracking-wide">Edit details</h2>
        <MemberForm
          mode="edit"
          today={todayInput}
          defaults={{
            name: member.name,
            phone: member.phone,
            plan: member.plan,
            planPrice: String(member.planPrice),
            startDate: toDateInput(member.startDate),
            endDate: toDateInput(member.endDate),
            balanceDueBy: member.balanceDueBy ? toDateInput(member.balanceDueBy) : "",
            notes: member.notes ?? "",
          }}
          onSubmit={updateMember.bind(null, member.id)}
          cancelHref="/admin/members"
        />
      </section>
    </div>
  );
}
