import { auth } from "@/auth";

/** Server Actions are public POST endpoints: every one must call this first. */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}
