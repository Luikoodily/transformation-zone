"use client";

import * as React from "react";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/admin/ui/button";
import { ConfirmActionButton } from "@/components/admin/confirm-action-button";
import type { ActionResult } from "@/lib/action-result";

export function AnnouncementRowActions({
  published,
  title,
  onToggle,
  onDelete,
}: {
  published: boolean;
  title: string;
  onToggle: (published: boolean) => Promise<ActionResult>;
  onDelete: () => Promise<ActionResult>;
}) {
  const [pending, start] = React.useTransition();
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const r = await onToggle(!published);
            if (r.ok) toast.success(r.message);
            else toast.error(r.message ?? "Could not update");
          })
        }
      >
        {published ? "Hide" : "Show"}
      </Button>
      <ConfirmActionButton
        trigger={
          <Button variant="ghost" size="icon-sm" aria-label={`Delete ${title}`}>
            <Trash2Icon />
          </Button>
        }
        title="Delete this post?"
        description={`"${title}" will be removed from the website.`}
        confirmLabel="Delete post"
        action={onDelete}
      />
    </div>
  );
}
