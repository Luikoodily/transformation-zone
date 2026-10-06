import Link from "next/link";
import Form from "next/form";
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, SearchIcon, XIcon } from "lucide-react";
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

const PAGE_SIZE = 25;

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; filter?: string; page?: string }>;
}) {
  const { q = "", filter: rawFilter, page: rawPage } = await searchParams;
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
  const matching = rows.filter((r) => matchesFilter(r.summary, filter));
  const countFor = (value: (typeof MEMBER_FILTERS)[number]["value"]) =>
    rows.filter((r) => matchesFilter(r.summary, value)).length;

  const pageCount = Math.max(1, Math.ceil(matching.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(rawPage) || 1), pageCount);
  const visible = matching.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const pageHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (filter !== "all") params.set("filter", filter);
    if (query) params.set("q", query);
    if (targetPage > 1) params.set("page", String(targetPage));
    const qs = params.toString();
    return qs ? `/admin/members?${qs}` : "/admin/members";
  };
  const filterHref = (value: string) => {
    // "All" means show everyone — drop the search too, otherwise it looks
    // broken (filter clears but the leftover query keeps the list narrowed).
    if (value === "all") return "/admin/members";
    const params = new URLSearchParams();
    params.set("filter", value);
    if (query) params.set("q", query);
    const qs = params.toString();
    return qs ? `/admin/members?${qs}` : "/admin/members";
  };
  const clearSearchHref = filter === "all" ? "/admin/members" : `/admin/members?filter=${filter}`;

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
              className={cn("bg-card pl-9", query && "pr-9")}
            />
            {query && (
              <Link
                href={clearSearchHref}
                aria-label="Clear search"
                className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <XIcon className="size-4" />
              </Link>
            )}
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
                  <TableHead className="hidden md:table-cell">Plan</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="hidden sm:table-cell">Expires</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
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
                    <TableCell className="hidden max-w-48 whitespace-normal md:table-cell">{member.plan}</TableCell>
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
                    <TableCell className="hidden sm:table-cell">
                      <div>{formatDate(member.endDate)}</div>
                      <div className="text-xs text-muted-foreground">{expiryHint(summary)}</div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
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

      {matching.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, matching.length)} of {matching.length}
          </p>
          <div className="flex items-center gap-1">
            {page <= 1 ? (
              <Button variant="outline" size="icon-sm" disabled aria-label="Previous page">
                <ChevronLeftIcon />
              </Button>
            ) : (
              <Button asChild variant="outline" size="icon-sm">
                <Link href={pageHref(page - 1)} aria-label="Previous page">
                  <ChevronLeftIcon />
                </Link>
              </Button>
            )}
            <span className="min-w-20 text-center text-sm text-muted-foreground">
              Page {page} of {pageCount}
            </span>
            {page >= pageCount ? (
              <Button variant="outline" size="icon-sm" disabled aria-label="Next page">
                <ChevronRightIcon />
              </Button>
            ) : (
              <Button asChild variant="outline" size="icon-sm">
                <Link href={pageHref(page + 1)} aria-label="Next page">
                  <ChevronRightIcon />
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
