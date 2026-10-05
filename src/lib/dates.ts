// Calendar dates (membership start/end, payment date, due date) are stored as
// UTC-midnight instants and moved around as "yyyy-MM-dd" strings. Treating them
// as plain calendar dates keeps them identical on the server, in the DB and in
// the browser regardless of timezone.

const DAY_MS = 86_400_000;
export const GYM_TIME_ZONE = "Asia/Kolkata";

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** Today's calendar date in the gym's timezone, as a UTC-midnight Date. */
export function todayUTC(now: Date = new Date()): Date {
  const ymd = new Intl.DateTimeFormat("en-CA", {
    timeZone: GYM_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  return new Date(`${ymd}T00:00:00.000Z`);
}

export function parseDateInput(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

export function toDateInput(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** "05 Oct 2026" */
export function formatDate(date: Date): string {
  return dateFormat.format(date);
}

export function daysBetween(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / DAY_MS);
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}

/** Adds calendar months, clamping to the last day of shorter months. */
export function addMonths(date: Date, months: number): Date {
  const target = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1));
  const lastDay = new Date(
    Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)
  ).getUTCDate();
  target.setUTCDate(Math.min(date.getUTCDate(), lastDay));
  return target;
}

/** Same as addMonths but on "yyyy-MM-dd" strings. Returns "" for invalid input. */
export function addMonthsToDateInput(value: string, months: number): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "";
  return toDateInput(addMonths(parseDateInput(value), months));
}

/** "2026-10" -> [first day of month, first day of next month) */
export function monthRange(month: string): { start: Date; end: Date } | null {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return null;
  const start = new Date(`${month}-01T00:00:00.000Z`);
  return { start, end: addMonths(start, 1) };
}

export function monthKey(date: Date): string {
  return date.toISOString().slice(0, 7);
}

export function formatMonth(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
