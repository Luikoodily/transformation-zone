"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/admin/ui/button";
import type { ActionResult } from "@/lib/action-result";
import type { MemberStatusValue } from "@/lib/members";

const OPTIONS: { value: MemberStatusValue; label: string }[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "EXPIRED", label: "Expired" },
  { value: "CANCELLED", label: "Cancelled" },
];

export function MemberStatusActions({
  current,
  onSelect,
}: {
  /** The stored (manual) status, not the derived one. */
  current: MemberStatusValue;
  onSelect: (status: MemberStatusValue) => Promise<ActionResult>;
}) {
  const [pending, startTransition] = React.useTransition();

  function select(status: MemberStatusValue) {
    startTransition(async () => {
      const result = await onSelect(status);
      if (result.ok) toast.success(result.message ?? "Status updated");
      else toast.error(result.message ?? "Could not update status");
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {OPTIONS.map((option) => (
        <Button
          key={option.value}
          type="button"
          size="sm"
          variant={current === option.value ? "default" : "outline"}
          disabled={pending || current === option.value}
          onClick={() => select(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
