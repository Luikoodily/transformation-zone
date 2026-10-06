import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/admin/page-header";
import { PlanRowActions } from "@/components/admin/plan-row-actions";
import { Badge } from "@/components/admin/ui/badge";
import { Button } from "@/components/admin/ui/button";
import { Card, CardContent } from "@/components/admin/ui/card";
import { formatINR } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { deletePlan, movePlan, setPlanActive } from "./actions";

export default async function PlansPage() {
  const plans = await prisma.membershipPlan.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Membership plans"
        description="Prices here show on the website and in the add-member plan picker. Change one when the gym's pricing changes."
        actions={
          <Button asChild>
            <Link href="/admin/plans/new">
              <PlusIcon />
              Add plan
            </Link>
          </Button>
        }
      />
      <Card className="py-0">
        <CardContent className="p-0">
          {plans.length === 0 ? (
            <EmptyState
              title="No plans yet"
              description="Add at least one plan so the website's pricing section has something to show."
              action={
                <Button asChild>
                  <Link href="/admin/plans/new">Add plan</Link>
                </Button>
              }
            />
          ) : (
            <ul className="divide-y">
              {plans.map((p, i) => (
                <li key={p.id} className="grid gap-2 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/admin/plans/${p.id}`} className="font-medium hover:underline">
                        {p.title}
                      </Link>
                      {p.note && <Badge variant="outline">{p.note}</Badge>}
                      {!p.active && <Badge variant="secondary">Hidden</Badge>}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatINR(p.amount)} · suggested {p.months} month{p.months === 1 ? "" : "s"}
                    </p>
                  </div>
                  <PlanRowActions
                    active={p.active}
                    title={p.title}
                    canMoveUp={i > 0}
                    canMoveDown={i < plans.length - 1}
                    onToggle={setPlanActive.bind(null, p.id)}
                    onMove={movePlan.bind(null, p.id)}
                    onDelete={deletePlan.bind(null, p.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
