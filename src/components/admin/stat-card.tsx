import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/admin/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone?: "default" | "warning" | "danger";
}) {
  return (
    <Card className="gap-2 py-5">
      <CardContent className="grid gap-1.5">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{label}</span>
          <span
            className={cn(
              "flex size-8 items-center justify-center rounded-full bg-muted text-foreground",
              tone === "warning" && "bg-amber-100 text-amber-900",
              tone === "danger" && "bg-red-100 text-red-800"
            )}
          >
            <Icon className="size-4" />
          </span>
        </div>
        <div className="font-display text-4xl leading-none tracking-wide">{value}</div>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}
