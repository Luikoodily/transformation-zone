"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/admin/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select";
import { Textarea } from "@/components/admin/ui/textarea";
import { DatePicker } from "@/components/admin/date-picker";
import { FormField, RupeeInput } from "@/components/admin/form-field";
import { membershipPlans, planLabel } from "@/data/membership";
import type { ActionResult } from "@/lib/action-result";
import { addMonthsToDateInput } from "@/lib/dates";
import { formatINR } from "@/lib/format";
import { PAYMENT_METHODS, type PaymentMethodValue } from "@/lib/members";

const CUSTOM_PLAN = "custom";

export type MemberFormValues = {
  name: string;
  phone: string;
  plan: string;
  planPrice: string;
  startDate: string;
  endDate: string;
  balanceDueBy: string;
  notes: string;
  paymentAmount: string;
  paymentMethod: PaymentMethodValue;
  paymentDate: string;
};

function toNumber(value: string): number {
  const n = Number(value.replace(/[,\s₹]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function presetIndexFor(plan: string): number {
  return membershipPlans.findIndex((p) => planLabel(p) === plan);
}

export function MemberForm({
  mode,
  today,
  defaults,
  onSubmit,
  cancelHref,
}: {
  mode: "create" | "edit";
  /** Gym-local "yyyy-MM-dd" for today, used for default dates. */
  today: string;
  defaults?: Partial<MemberFormValues>;
  onSubmit: (values: MemberFormValues) => Promise<ActionResult>;
  cancelHref: string;
}) {
  const [values, setValues] = React.useState<MemberFormValues>({
    name: "",
    phone: "",
    plan: "",
    planPrice: "",
    startDate: today,
    endDate: "",
    balanceDueBy: "",
    notes: "",
    paymentAmount: "",
    paymentMethod: "CASH",
    paymentDate: today,
    ...defaults,
  });
  const [planChoice, setPlanChoice] = React.useState<string>(() => {
    const index = presetIndexFor(defaults?.plan ?? "");
    if (index >= 0) return String(index);
    return defaults?.plan ? CUSTOM_PLAN : "";
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [pending, startTransition] = React.useTransition();
  // Once the admin edits the end date by hand, stop auto-filling it from the plan.
  const endDateTouched = React.useRef(mode === "edit");

  function set<K extends keyof MemberFormValues>(key: K, value: MemberFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function choosePlan(choice: string) {
    setPlanChoice(choice);
    if (choice === CUSTOM_PLAN) {
      setValues((current) => ({ ...current, plan: presetIndexFor(current.plan) >= 0 ? "" : current.plan }));
      return;
    }
    const preset = membershipPlans[Number(choice)];
    if (!preset) return;
    setValues((current) => ({
      ...current,
      plan: planLabel(preset),
      planPrice: String(preset.amount),
      endDate: endDateTouched.current
        ? current.endDate
        : addMonthsToDateInput(current.startDate, preset.months),
    }));
  }

  function changeStartDate(startDate: string) {
    setValues((current) => {
      const preset = planChoice !== CUSTOM_PLAN ? membershipPlans[Number(planChoice)] : undefined;
      const endDate =
        !endDateTouched.current && preset
          ? addMonthsToDateInput(startDate, preset.months)
          : current.endDate;
      return { ...current, startDate, endDate };
    });
  }

  const planPrice = toNumber(values.planPrice);
  const advance = toNumber(values.paymentAmount);
  const balance = Math.max(planPrice - advance, 0);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    startTransition(async () => {
      const result = await onSubmit(values);
      if (result.ok) {
        if (result.message) toast.success(result.message);
        return;
      }
      setErrors(result.fieldErrors ?? {});
      toast.error(result.message ?? "Could not save the member");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6" noValidate>
      <Card>
        <CardHeader>
          <CardTitle>Member details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <FormField id="name" label="Full name" error={errors.name}>
            <Input
              id="name"
              name="name"
              autoComplete="off"
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
              aria-invalid={!!errors.name}
              required
            />
          </FormField>
          <FormField id="phone" label="Phone / WhatsApp" error={errors.phone} hint="Used for WhatsApp reminders.">
            <Input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="off"
              value={values.phone}
              onChange={(e) => set("phone", e.target.value)}
              aria-invalid={!!errors.phone}
              required
            />
          </FormField>
          <FormField id="notes" label="Notes" error={errors.notes} className="md:col-span-2">
            <Textarea
              id="notes"
              name="notes"
              rows={2}
              value={values.notes}
              onChange={(e) => set("notes", e.target.value)}
              aria-invalid={!!errors.notes}
              placeholder="Anything worth remembering — goals, injuries, agreed discounts…"
            />
          </FormField>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Plan &amp; dates</CardTitle>
          <CardDescription>
            Picking a plan fills the price{mode === "create" ? " and a suggested end date" : ""}. Everything stays editable.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <FormField id="plan-choice" label="Plan" error={planChoice === CUSTOM_PLAN ? undefined : errors.plan}>
            <Select value={planChoice} onValueChange={choosePlan}>
              <SelectTrigger id="plan-choice" className="w-full bg-card" aria-invalid={!!errors.plan && planChoice !== CUSTOM_PLAN}>
                <SelectValue placeholder="Choose a plan" />
              </SelectTrigger>
              <SelectContent>
                {membershipPlans.map((plan, index) => (
                  <SelectItem key={planLabel(plan)} value={String(index)}>
                    {planLabel(plan)} — {formatINR(plan.amount)}
                  </SelectItem>
                ))}
                <SelectItem value={CUSTOM_PLAN}>Custom plan…</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          {planChoice === CUSTOM_PLAN && (
            <FormField id="plan" label="Plan name" error={errors.plan}>
              <Input
                id="plan"
                name="plan"
                value={values.plan}
                onChange={(e) => set("plan", e.target.value)}
                aria-invalid={!!errors.plan}
                placeholder="e.g. 3 Month Strength"
              />
            </FormField>
          )}

          <FormField id="planPrice" label="Plan price (total fee)" error={errors.planPrice}>
            <RupeeInput>
              <Input
                id="planPrice"
                name="planPrice"
                inputMode="numeric"
                className="pl-7"
                value={values.planPrice}
                onChange={(e) => set("planPrice", e.target.value)}
                aria-invalid={!!errors.planPrice}
                required
              />
            </RupeeInput>
          </FormField>

          <FormField id="startDate" label="Start date" error={errors.startDate}>
            <DatePicker id="startDate" value={values.startDate} onChange={changeStartDate} invalid={!!errors.startDate} />
          </FormField>

          <FormField id="endDate" label="End date" error={errors.endDate}>
            <DatePicker
              id="endDate"
              value={values.endDate}
              onChange={(value) => {
                endDateTouched.current = true;
                set("endDate", value);
              }}
              invalid={!!errors.endDate}
            />
          </FormField>

          <FormField
            id="balanceDueBy"
            label="Balance due by"
            error={errors.balanceDueBy}
            hint="Optional — when the remaining amount is expected."
          >
            <DatePicker
              id="balanceDueBy"
              value={values.balanceDueBy}
              onChange={(value) => set("balanceDueBy", value)}
              clearable
              placeholder="No due date"
              invalid={!!errors.balanceDueBy}
            />
          </FormField>
        </CardContent>
      </Card>

      {mode === "create" && (
        <Card>
          <CardHeader>
            <CardTitle>Payment received now</CardTitle>
            <CardDescription>
              Enter the full fee or just an advance. The balance is tracked automatically and shows up on the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <FormField id="paymentAmount" label="Amount paid" error={errors.paymentAmount}>
              <RupeeInput>
                <Input
                  id="paymentAmount"
                  name="paymentAmount"
                  inputMode="numeric"
                  className="pl-7"
                  placeholder="0"
                  value={values.paymentAmount}
                  onChange={(e) => set("paymentAmount", e.target.value)}
                  aria-invalid={!!errors.paymentAmount}
                />
              </RupeeInput>
            </FormField>
            <FormField id="paymentMethod" label="Method" error={errors.paymentMethod}>
              <Select value={values.paymentMethod} onValueChange={(value) => set("paymentMethod", value as PaymentMethodValue)}>
                <SelectTrigger id="paymentMethod" className="w-full bg-card">
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
            <FormField id="paymentDate" label="Payment date" error={errors.paymentDate}>
              <DatePicker id="paymentDate" value={values.paymentDate} onChange={(value) => set("paymentDate", value)} invalid={!!errors.paymentDate} />
            </FormField>

            {planPrice > 0 && (
              <div className="rounded-lg border bg-muted/60 px-4 py-3 text-sm md:col-span-3">
                {advance <= 0 ? (
                  <span>
                    Nothing paid yet — <strong>{formatINR(planPrice)}</strong> will be due.
                  </span>
                ) : balance === 0 ? (
                  <span className="font-medium text-emerald-800">Paid in full — nothing will be due.</span>
                ) : (
                  <span>
                    Advance <strong>{formatINR(advance)}</strong> of {formatINR(planPrice)} ·{" "}
                    <strong className="text-amber-900">{formatINR(balance)} balance due</strong>
                  </span>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button type="button" variant="ghost" asChild>
          <Link href={cancelHref}>Cancel</Link>
        </Button>
        <Button type="submit" disabled={pending}>
          {pending && <Loader2Icon className="animate-spin" />}
          {mode === "create" ? "Add member" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
