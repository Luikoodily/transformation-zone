"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/admin/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select";
import { Textarea } from "@/components/admin/ui/textarea";
import { DatePicker } from "@/components/admin/date-picker";
import { FormField } from "@/components/admin/form-field";
import type { ActionResult } from "@/lib/action-result";
import { ANNOUNCEMENT_KINDS, type AnnouncementKindValue } from "@/lib/announcements";

export type AnnouncementFormValues = {
  kind: AnnouncementKindValue;
  title: string;
  body: string;
  startsOn: string;
  endsOn: string;
  link: string;
  imageUrl: string;
  published: boolean;
};

export function AnnouncementForm({
  mode,
  today,
  defaults,
  onSubmit,
}: {
  mode: "create" | "edit";
  today: string;
  defaults?: Partial<AnnouncementFormValues>;
  onSubmit: (values: AnnouncementFormValues) => Promise<ActionResult>;
}) {
  const [values, setValues] = React.useState<AnnouncementFormValues>({
    kind: "NOTICE",
    title: "",
    body: "",
    startsOn: today,
    endsOn: "",
    link: "",
    imageUrl: "",
    published: true,
    ...defaults,
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [pending, startTransition] = React.useTransition();

  function set<K extends keyof AnnouncementFormValues>(key: K, value: AnnouncementFormValues[K]) {
    setValues((c) => ({ ...c, [key]: value }));
  }

  const hint = ANNOUNCEMENT_KINDS.find((k) => k.value === values.kind)?.hint;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    startTransition(async () => {
      const result = await onSubmit(values);
      if (result.ok) return;
      setErrors(result.fieldErrors ?? {});
      toast.error(result.message ?? "Could not save the post");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6" noValidate>
      <Card>
        <CardHeader>
          <CardTitle>What do you want to tell members?</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <FormField id="kind" label="Type" hint={hint} error={errors.kind}>
            <Select value={values.kind} onValueChange={(v) => set("kind", v as AnnouncementKindValue)}>
              <SelectTrigger id="kind" className="w-full bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ANNOUNCEMENT_KINDS.map((k) => (
                  <SelectItem key={k.value} value={k.value}>
                    {k.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField id="title" label="Title" error={errors.title}>
            <Input id="title" value={values.title} onChange={(e) => set("title", e.target.value)} aria-invalid={!!errors.title} placeholder="Gym closed for Christmas" />
          </FormField>
          <FormField id="body" label="Details (optional)" error={errors.body} className="md:col-span-2">
            <Textarea id="body" rows={3} value={values.body} onChange={(e) => set("body", e.target.value)} aria-invalid={!!errors.body} />
          </FormField>
          <FormField id="startsOn" label="Date" error={errors.startsOn}>
            <DatePicker id="startsOn" value={values.startsOn} onChange={(v) => set("startsOn", v)} invalid={!!errors.startsOn} />
          </FormField>
          <FormField id="endsOn" label="Until (optional)" hint="For multi-day closures." error={errors.endsOn}>
            <DatePicker id="endsOn" value={values.endsOn} onChange={(v) => set("endsOn", v)} clearable placeholder="Single day" invalid={!!errors.endsOn} />
          </FormField>
          <FormField id="link" label="Link (optional)" error={errors.link}>
            <Input id="link" inputMode="url" value={values.link} onChange={(e) => set("link", e.target.value)} aria-invalid={!!errors.link} placeholder="https://www.instagram.com/p/…" />
          </FormField>
          <FormField id="imageUrl" label="Image link (optional)" error={errors.imageUrl}>
            <Input id="imageUrl" inputMode="url" value={values.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} aria-invalid={!!errors.imageUrl} placeholder="https://…/poster.jpg" />
          </FormField>
          <label className="flex items-center gap-2 text-sm md:col-span-2">
            <input type="checkbox" className="size-4" checked={values.published} onChange={(e) => set("published", e.target.checked)} />
            Show on the website
          </label>
        </CardContent>
      </Card>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button type="button" variant="ghost" asChild>
          <Link href="/admin/announcements">Cancel</Link>
        </Button>
        <Button type="submit" disabled={pending}>
          {pending && <Loader2Icon className="animate-spin" />}
          {mode === "create" ? "Publish post" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
