"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/admin/ui/button";
import type { ActionResult } from "@/lib/action-result";

export function StaffActiveButton({
  active,
  onToggle,
}: {
  active: boolean;
  onToggle: (active: boolean) => Promise<ActionResult>;
}) {
  const [pending, startTransition] = React.useTransition();

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await onToggle(!active);
          if (result.ok) toast.success(result.message ?? "Updated");
          else toast.error(result.message ?? "Could not update");
        })
      }
    >
      {active ? "Deactivate" : "Activate"}
    </Button>
  );
}
