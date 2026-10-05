import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { logout } from "./actions";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <AdminShell email={session.user.email ?? "admin"} logout={logout}>
      {children}
    </AdminShell>
  );
}
