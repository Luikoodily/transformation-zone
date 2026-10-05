"use client";

import * as React from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select";
import { DatePicker } from "@/components/admin/date-picker";
import { FormField, RupeeInput } from "@/components/admin/form-field";
import type { ActionResult } from "@/lib/action-result";
import { formatINR } from "@/lib/format";
import { PAYMENT_METHODS, type PaymentMethodValue } from "@/lib/members";

type PaymentFormValues = {
  amount: string;
  paidAt: string;
  method: PaymentMethodValue;
  note: string;
};

export function RecordPaymentForm({
  balance,
  today,
  onSubmit,
}: {
  balance: number;
  /** Gym-local "yyyy-MM-dd" for today. */
  today: string;
  onSubmit: (values: PaymentFormValues) => Promise<ActionResult>;
}) {
  const [values, setValues] = React.useState<PaymentFormValues>({
    amount: "",
    paidAt: today,
    method: "CASH",
    note: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [pending, startTransition] = React.useTransition();

  function set<K extends keyof PaymentFormValues>(key: K, value: PaymentFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    startTransition(async () => {
      const result = await onSubmit(values);
      if (result.ok) {
        toast.success(result.message ?? "Payment recorded");
        setValues((current) => ({ ...current, amount: "", note: "" }));
        return;
      }
      setErrors(result.fieldErrors ?? {});
      toast.error(result.message ?? "Could not record the payment");
    });
  }

  if (balance === 0) {
    return (
      <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
        Paid in full — nothing more to collect on this plan.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="pay-amount" label="Amount received" error={errors.amount}>
          <RupeeInput>
            <Input
              id="pay-amount"
              inputMode="numeric"
              className="pl-7"
              placeholder="0"
              value={values.amount}
              onChange={(e) => set("amount", e.target.value)}
              aria-invalid={!!errors.amount}
            />
          </RupeeInput>
        </FormField>
        <FormField id="pay-date" label="Date" error={errors.paidAt}>
          <DatePicker id="pay-date" value={values.paidAt} onChange={(value) => set("paidAt", value)} invalid={!!errors.paidAt} />
        </FormField>
        <FormField id="pay-method" label="Method" error={errors.method}>
          <Select value={values.method} onValueChange={(value) => set("method", value as PaymentMethodValue)}>
            <SelectTrigger id="pay-method" className="w-full bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_METHODS.map((method) => (
                <SelectItem key={method.value} value={method.value}>
                  {method.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField id="pay-note" label="Note" error={errors.note}>
          <Input
            id="pay-note"
            value={values.note}
            onChange={(e) => set("note", e.target.value)}
            aria-invalid={!!errors.note}
            placeholder="Optional"
          />
        </FormField>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit" disabled={pending}>
          {pending && <Loader2Icon className="animate-spin" />}
          Record payment
        </Button>
        <Button type="button" variant="outline" onClick={() => set("amount", String(balance))}>
          Fill full balance ({formatINR(balance)})
        </Button>
      </div>
    </form>
  );
}
