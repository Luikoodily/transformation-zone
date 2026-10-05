"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, XIcon } from "lucide-react";
import { Button } from "@/components/admin/ui/button";
import { Calendar } from "@/components/admin/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/admin/ui/popover";
import { cn } from "@/lib/utils";

// The value is a calendar date as "yyyy-MM-dd" (or ""). The Calendar works with
// local-time Dates, so conversion uses local y/m/d — never an instant — which
// keeps the picked day identical in every timezone.

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function fromValue(value: string): Date | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return undefined;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function toValue(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function DatePicker({
  id,
  value,
  onChange,
  placeholder = "Pick a date",
  clearable = false,
  invalid = false,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  clearable?: boolean;
  invalid?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const selected = fromValue(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="relative">
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            aria-invalid={invalid || undefined}
            className={cn(
              "w-full justify-start bg-card font-normal",
              clearable && selected && "pr-9",
              !selected && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="text-muted-foreground" />
            {selected ? format(selected, "dd MMM yyyy") : placeholder}
          </Button>
        </PopoverTrigger>
        {clearable && selected && (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="Clear date"
            className="absolute top-1/2 right-1.5 -translate-y-1/2"
            onClick={() => onChange("")}
          >
            <XIcon />
          </Button>
        )}
      </div>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected}
          captionLayout="dropdown"
          startMonth={new Date(2020, 0)}
          endMonth={new Date(2040, 11)}
          onSelect={(date) => {
            if (!date) return;
            onChange(toValue(date));
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
