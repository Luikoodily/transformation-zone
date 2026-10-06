"use client";

import * as React from "react";
import { Loader2Icon, ReceiptIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/admin/ui/button";
import { downloadBlob, renderReceiptPng, type ReceiptData } from "@/lib/receipt";
import { whatsappLinkTo } from "@/lib/whatsapp";

export function ReceiptButton({
  data,
  memberPhone,
  size = "icon-sm",
  label,
}: {
  data: ReceiptData;
  memberPhone: string;
  size?: "icon-sm" | "sm";
  label?: string;
}) {
  const [pending, setPending] = React.useState(false);

  async function handleClick() {
    setPending(true);
    try {
      const blob = await renderReceiptPng(data);
      downloadBlob(blob, `receipt-${data.receiptNo}.png`);
      toast.success("Receipt downloaded", {
        description: "Open WhatsApp and attach it from your downloads to send it.",
        action: {
          label: "Open WhatsApp",
          onClick: () => window.open(whatsappLinkTo(memberPhone, `Hi ${data.memberName}, here's your payment receipt.`), "_blank"),
        },
      });
    } catch {
      toast.error("Could not generate the receipt");
    } finally {
      setPending(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size={size}
      onClick={handleClick}
      disabled={pending}
      aria-label={label ? undefined : "Download receipt"}
      title="Download payment receipt (PNG)"
    >
      {pending ? <Loader2Icon className="animate-spin" /> : <ReceiptIcon />}
      {label}
    </Button>
  );
}
