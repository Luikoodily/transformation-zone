"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion } from "motion/react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useActiveSection, useScrolled } from "@/hooks/use-active-section";
import { whatsappUrl } from "@/data/location";

const links = [
  { href: "#about", label: "About", id: "about" },
  { href: "#programs", label: "Programs", id: "programs" },
  { href: "#results", label: "Results", id: "results" },
  { href: "#gym", label: "Gym", id: "gym" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const activeId = useActiveSection(links.map((l) => l.id));
  const scrolled = useScrolled();

  return (
    <header className="sticky top-0 z-30">
      {/* Desktop floating pill nav — sticky, subtle elevation once scrolled */}
      <div
        className={cn(
          "hidden justify-center pt-7 pb-3 transition-[padding] duration-300 md:flex",
          scrolled && "pt-3"
        )}
      >
        <nav
          aria-label="Primary"
          className={cn(
            "flex items-center gap-9 rounded-full border border-line bg-paper py-3 pr-3.5 pl-6 transition-shadow duration-300",
            scrolled ? "shadow-[0_10px_28px_rgba(20,18,13,0.12)]" : "shadow-[0_8px_24px_rgba(20,18,13,0.06)]"
          )}
        >
          <Logo className="h-[30px] w-auto" />
          {links.map((l) => {
            const isActive = activeId === l.id;
            return (
              <a
                key={l.href}
                href={l.href}
                aria-current={isActive ? "true" : undefined}
                className="relative py-1 font-body text-[12.5px] font-bold text-ink hover:text-accent-ink"
              >
                {l.label}
                {isActive && (
                  <motion.span
                    layoutId="active-nav-indicator"
                    className="absolute right-0 -bottom-1.5 left-0 h-[2px] rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 420, damping: 38, mass: 0.6 }}
                  />
                )}
              </a>
            );
          })}
          <Button
            href={whatsappUrl("Hi, I'd like to book a consultation.")}
            className="px-5.5 py-2.5"
          >
            Start
          </Button>
        </nav>
      </div>

      {/* Mobile compact header */}
      <div className="relative flex items-center justify-between bg-paper px-5 py-4 md:hidden">
        <Logo className="h-[26px] w-auto" />
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-ink text-ink"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {open && (
        <nav aria-label="Primary" className="flex flex-col gap-1 bg-paper px-5 pb-4 md:hidden">
          {links.map((l) => {
            const isActive = activeId === l.id;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "border-t border-line py-3 font-body text-sm font-bold",
                  isActive ? "text-accent-ink" : "text-ink"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
