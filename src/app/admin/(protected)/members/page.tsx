import Link from "next/link";
import Form from "next/form";
import { ChevronRightIcon, PlusIcon, SearchIcon } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/admin/page-header";
import { OverdueBadge, PaymentBadge, StatusBadge } from "@/components/admin/status-badges";
import { Button, buttonVariants } from "@/components/admin/ui/button";
import { Card, CardContent } from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import { Progress } from "@/components/admin/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/admin/ui/table";
import { formatDate, todayUTC } from "@/lib/dates";
import { formatINR } from "@/lib/format";
import {
  MEMBER_FILTERS,
  matchesFilter,
  parseMemberFilter,
  summarizeMember,
  type MemberSummary,
} from "@/lib/members";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

function expiryHint(summary: MemberSummary): string {
  if (summary.effectiveStatus === "CANCELLED") return "";
  if (summary.daysLeft < 0) {
    const ago = Math.abs(summary.daysLeft);
    return `${ago} day${ago === 1 ? "" : "s"} ago`;
  }
  if (summary.daysLeft === 0) return "today";
  return `in ${summary.daysLeft} day${summary.daysLeft === 1 ? "" : "s"}`;
}

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; filter?: string }>;
}) {
  const { q = "", filter: rawFilter } = await searchParams;
  const filter = parseMemberFilter(rawFilter);
  const query = q.trim();
  const today = todayUTC();

  const members = await prisma.member.findMany({
    where: query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { phone: { contains: query } },
          ],
        }
      : undefined,
    include: { payments: { select: { amount: true } } },
    orderBy: { endDate: "asc" },
  });

  const rows = members.map((member) => ({ member, summary: summarizeMember(member, today) }));
  const visible = rows.filter((r) => matchesFilter(r.summary, filter));
  const countFor = (value: (typeof MEMBER_FILTERS)[number]["value"]) =>
    rows.filter((r) => matchesFilter(r.summary, value)).length;

  const filterHref = (value: string) => {
    const params = new URLSearchParams();
    if (value !== "all") params.set("filter", value);
    if (query) params.set("q", query);
    const qs = params.toString();
    return qs ? `/admin/members?${qs}` : "/admin/members";
  };

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Members"
        description="Everyone on a plan, with their payment status at a glance."
        actions={
          <Button asChild>
            <Link href="/admin/members/new">
              <PlusIcon />
              Add member
            </Link>
          </Button>
        }
      />

      <div className="grid gap-3">
        <Form action="/admin/members" className="flex gap-2">
          {filter !== "all" && <input type="hidden" name="filter" value={filter} />}
          <div className="relative flex-1 sm:max-w-sm">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="q"
              defaultValue={query}
              placeholder="Search by name or phone"
              aria-label="Search members"
              className="bg-card pl-9"
            />
          </div>
          <Button type="submit" variant="outline">
            Search
          </Button>
        </Form>

        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter members">
          {MEMBER_FILTERS.map((f) => (
            <Link
              key={f.value}
              href={filterHref(f.value)}
              role="tab"
              aria-selected={filter === f.value}
              className={cn(
                buttonVariants({ variant: filter === f.value ? "default" : "outline", size: "sm" }),
                "rounded-full"
              )}
            >
              {f.label}
              <span className="text-xs opacity-70">{countFor(f.value)}</span>
            </Link>
          ))}
        </div>
      </div>

      <Card className="py-0">
        <CardContent className="p-0">
          {rows.length === 0 && !query ? (
            <EmptyState
              title="No members yet"
              description="Add your first member to start tracking plans and payments."
              action={
                <Button asChild>
                  <Link href="/admin/members/new">Add member</Link>
                </Button>
              }
            />
          ) : visible.length === 0 ? (
            <EmptyState
              title="No members match"
              description="Try a different search or filter."
              action={
                <Button asChild variant="outline">
                  <Link href="/admin/members">Clear filters</Link>
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="pl-4">Member</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10 pr-4" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map(({ member, summary }) => (
                  <TableRow key={member.id}>
                    <TableCell className="pl-4">
                      <Link href={`/admin/members/${member.id}`} className="font-medium hover:underline">
                        {member.name}
                      </Link>
                      <div className="text-xs text-muted-foreground">{member.phone}</div>
                    </TableCell>
                    <TableCell className="max-w-48 whitespace-normal">{member.plan}</TableCell>
                    <TableCell className="min-w-48">
                      <div className="grid gap-1.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <PaymentBadge state={summary.paymentState} />
                          {summary.overdue && <OverdueBadge />}
                        </div>
                        <Progress value={summary.percent} className="h-1.5" />
                        <span className="text-xs text-muted-foreground">
                          {formatINR(summary.paid)} of {formatINR(member.planPrice)}
                          {summary.balance > 0 ? ` · ${formatINR(summary.balance)} due` : ""}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{formatDate(member.endDate)}</div>
                      <div className="text-xs text-muted-foreground">{expiryHint(summary)}</div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={summary.effectiveStatus} />
                    </TableCell>
                    <TableCell className="pr-4">
                      <Button asChild variant="ghost" size="icon-sm">
                        <Link href={`/admin/members/${member.id}`} aria-label={`Open ${member.name}`}>
                          <ChevronRightIcon />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
