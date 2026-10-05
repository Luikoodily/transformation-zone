import type { ZodError } from "zod";

export type ActionResult =
  | { ok: true; message?: string }
  | { ok: false; message?: string; fieldErrors?: Record<string, string> };

/** First error message per top-level field, for showing next to each input. */
export function fromZodError(error: ZodError): ActionResult {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!(key in fieldErrors)) fieldErrors[key] = issue.message;
  }
  return { ok: false, message: "Please fix the highlighted fields.", fieldErrors };
}
