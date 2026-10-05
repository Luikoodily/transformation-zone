"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import type { ActionResult } from "@/lib/action-result";

export async function loginAction(email: string, password: string): Promise<ActionResult> {
  try {
    await signIn("credentials", { email, password, redirectTo: "/admin" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, message: "Invalid email or password." };
    }
    throw error;
  }
  return { ok: true };
}
