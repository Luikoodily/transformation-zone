"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboardIcon,
  LogOutIcon,
  MenuIcon,
  UserCogIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/admin/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/admin/ui/sheet";
import { Toaster } from "@/components/admin/ui/sonner";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboardIcon, exact: true },
  { href: "/admin/members", label: "Members", icon: UsersIcon, exact: false },
  { href: "/admin/payments", label: "Payments", icon: WalletIcon, exact: false },
  { href: "/admin/staff", label: "Staff", icon: UserCogIcon, exact: false },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin" className="grid gap-1">
      {NAV.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function AccountBlock({ email, logout }: { email: string; logout: () => Promise<void> }) {
  return (
    <div className="grid gap-3 border-t pt-4">
      <p className="truncate px-1 text-xs text-muted-foreground" title={email}>
        Signed in as <span className="font-medium text-foreground">{email}</span>
      </p>
      <form action={logout}>
        <Button type="submit" variant="outline" size="sm" className="w-full">
          <LogOutIcon />
          Log out
        </Button>
      </form>
    </div>
  );
}

export function AdminShell({
  email,
  logout,
  children,
}: {
  email: string;
  logout: () => Promise<void>;
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background md:grid md:grid-cols-[16rem_1fr]">
      <aside className="hidden border-r bg-card md:sticky md:top-0 md:flex md:h-screen md:flex-col md:justify-between md:p-4">
        <div className="grid gap-6">
          <Link href="/admin" className="flex items-center gap-2 px-2 pt-1" aria-label="Dashboard home">
            <Logo className="h-9 w-auto" />
            <span className="font-display text-lg tracking-wide">Admin</span>
          </Link>
          <NavLinks />
        </div>
        <AccountBlock email={email} logout={logout} />
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-card/95 px-4 backdrop-blur md:hidden">
          <Link href="/admin" className="flex items-center gap-2" aria-label="Dashboard home">
            <Logo className="h-8 w-auto" />
            <span className="font-display text-base tracking-wide">Admin</span>
          </Link>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu">
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex w-72 flex-col justify-between p-4">
              <SheetHeader className="p-0">
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription className="sr-only">Admin navigation</SheetDescription>
              </SheetHeader>
              <div className="flex-1 pt-2">
                <NavLinks onNavigate={() => setMenuOpen(false)} />
              </div>
              <AccountBlock email={email} logout={logout} />
            </SheetContent>
          </Sheet>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 p-4 md:p-8">{children}</main>
      </div>

      <Toaster position="top-right" />
    </div>
  );
}
