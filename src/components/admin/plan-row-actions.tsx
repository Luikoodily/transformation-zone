"use client";

import * as React from "react";
import { ArrowDownIcon, ArrowUpIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/admin/ui/button";
import { ConfirmActionButton } from "@/components/admin/confirm-action-button";
import type { ActionResult } from "@/lib/action-result";

export function PlanRowActions({
  active,
  title,
  canMoveUp,
  canMoveDown,
  onToggle,
  onMove,
  onDelete,
}: {
  active: boolean;
  title: string;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onToggle: (active: boolean) => Promise<ActionResult>;
  onMove: (direction: "up" | "down") => Promise<ActionResult>;
  onDelete: () => Promise<ActionResult>;
}) {
  const [pending, start] = React.useTransition();

  function run(action: () => Promise<ActionResult>, okMessage?: string) {
    start(async () => {
      const r = await action();
      if (r.ok) {
        if (okMessage) toast.success(okMessage);
      } else toast.error(r.message ?? "Could not update");
    });
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Button size="icon-sm" variant="ghost" disabled={pending || !canMoveUp} aria-label="Move up" onClick={() => run(() => onMove("up"))}>
        <ArrowUpIcon />
      </Button>
      <Button size="icon-sm" variant="ghost" disabled={pending || !canMoveDown} aria-label="Move down" onClick={() => run(() => onMove("down"))}>
        <ArrowDownIcon />
      </Button>
      <Button size="sm" variant="outline" disabled={pending} onClick={() => run(() => onToggle(!active), active ? "Hidden from the website" : "Shown on the website")}>
        {active ? "Hide" : "Show"}
      </Button>
      <ConfirmActionButton
        trigger={
          <Button variant="ghost" size="icon-sm" aria-label={`Delete ${title}`}>
            <Trash2Icon />
          </Button>
        }
        title="Delete this plan?"
        description={`"${title}" will no longer appear on the website or in the add-member plan picker.`}
        confirmLabel="Delete plan"
        action={onDelete}
      />
    </div>
  );
}
