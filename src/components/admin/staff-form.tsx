"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/admin/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import { FormField } from "@/components/admin/form-field";
import type { ActionResult } from "@/lib/action-result";

type StaffFormValues = { name: string; role: string; phone: string };

export function StaffForm({
  mode,
  defaults,
  onSubmit,
}: {
  mode: "create" | "edit";
  defaults?: Partial<StaffFormValues>;
  onSubmit: (values: StaffFormValues) => Promise<ActionResult>;
}) {
  const [values, setValues] = React.useState<StaffFormValues>({
    name: "",
    role: "",
    phone: "",
    ...defaults,
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [pending, startTransition] = React.useTransition();

  function set<K extends keyof StaffFormValues>(key: K, value: StaffFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    startTransition(async () => {
      const result = await onSubmit(values);
      if (result.ok) return;
      setErrors(result.fieldErrors ?? {});
      toast.error(result.message ?? "Could not save the staff member");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6" noValidate>
      <Card>
        <CardHeader>
          <CardTitle>Staff details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <FormField id="staff-name" label="Full name" error={errors.name}>
            <Input
              id="staff-name"
              autoComplete="off"
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
              aria-invalid={!!errors.name}
              required
            />
          </FormField>
          <FormField id="staff-role" label="Role" error={errors.role} hint='e.g. "Trainer", "Front desk"'>
            <Input
              id="staff-role"
              autoComplete="off"
              value={values.role}
              onChange={(e) => set("role", e.target.value)}
              aria-invalid={!!errors.role}
              required
            />
          </FormField>
          <FormField id="staff-phone" label="Phone" error={errors.phone}>
            <Input
              id="staff-phone"
              type="tel"
              autoComplete="off"
              value={values.phone}
              onChange={(e) => set("phone", e.target.value)}
              aria-invalid={!!errors.phone}
              required
            />
          </FormField>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button type="button" variant="ghost" asChild>
          <Link href="/admin/staff">Cancel</Link>
        </Button>
        <Button type="submit" disabled={pending}>
          {pending && <Loader2Icon className="animate-spin" />}
          {mode === "create" ? "Add staff member" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
