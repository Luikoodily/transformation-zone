"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/admin/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import { FormField, RupeeInput } from "@/components/admin/form-field";
import type { ActionResult } from "@/lib/action-result";

type PlanFormValues = { title: string; amount: string; months: string; note: string; active: boolean };

export function PlanForm({
  mode,
  defaults,
  onSubmit,
}: {
  mode: "create" | "edit";
  defaults?: Partial<PlanFormValues>;
  onSubmit: (values: PlanFormValues) => Promise<ActionResult>;
}) {
  const [values, setValues] = React.useState<PlanFormValues>({
    title: "",
    amount: "",
    months: "1",
    note: "",
    active: true,
    ...defaults,
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [pending, startTransition] = React.useTransition();

  function set<K extends keyof PlanFormValues>(key: K, value: PlanFormValues[K]) {
    setValues((c) => ({ ...c, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    startTransition(async () => {
      const result = await onSubmit(values);
      if (result.ok) return;
      setErrors(result.fieldErrors ?? {});
      toast.error(result.message ?? "Could not save the plan");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6" noValidate>
      <Card>
        <CardHeader>
          <CardTitle>Plan details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <FormField id="plan-title" label="Title" error={errors.title} className="md:col-span-2">
            <Input id="plan-title" value={values.title} onChange={(e) => set("title", e.target.value)} aria-invalid={!!errors.title} placeholder='e.g. "3 Month Strength"' />
          </FormField>
          <FormField id="plan-amount" label="Price" error={errors.amount}>
            <RupeeInput>
              <Input id="plan-amount" inputMode="numeric" className="pl-7" value={values.amount} onChange={(e) => set("amount", e.target.value)} aria-invalid={!!errors.amount} />
            </RupeeInput>
          </FormField>
          <FormField id="plan-months" label="Suggested duration (months)" hint="Pre-fills the end date when this plan is picked." error={errors.months}>
            <Input id="plan-months" type="number" min={1} max={60} value={values.months} onChange={(e) => set("months", e.target.value)} aria-invalid={!!errors.months} />
          </FormField>
          <FormField id="plan-note" label="Note (optional)" hint='e.g. "Couple"' error={errors.note}>
            <Input id="plan-note" value={values.note} onChange={(e) => set("note", e.target.value)} aria-invalid={!!errors.note} />
          </FormField>
          <label className="flex items-center gap-2 text-sm md:col-span-2">
            <input type="checkbox" className="size-4" checked={values.active} onChange={(e) => set("active", e.target.checked)} />
            Show on the website
          </label>
        </CardContent>
      </Card>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button type="button" variant="ghost" asChild>
          <Link href="/admin/plans">Cancel</Link>
        </Button>
        <Button type="submit" disabled={pending}>
          {pending && <Loader2Icon className="animate-spin" />}
          {mode === "create" ? "Add plan" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
