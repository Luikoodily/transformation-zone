"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { programs } from "@/data/programs";
import { demoAssets } from "@/data/demo-assets";

const previewImages = [
  demoAssets.programs.personalTraining,
  demoAssets.programs.fatLoss,
  demoAssets.programs.strength,
  demoAssets.programs.onlineCoaching,
];

export function Programs() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="programs" className="bg-paper px-6 py-16 md:px-0 md:py-[120px]">
      <div className="mb-8 flex flex-col gap-2 px-0 md:mb-14 md:flex-row md:items-end md:justify-between md:px-14">
        <h2 className="font-display text-4xl text-ink md:text-[56px]">WHAT I OFFER.</h2>
        <p className="font-body text-xs text-ink-soft md:text-[13px]">
          Tap a row to expand
        </p>
      </div>
      <div className="flex flex-col">
        {programs.map((program, i) => {
          const open = openIndex === i;
          return (
            <div key={program.index} className="border-t border-line last:border-b">
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : i)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-4 py-6 text-left md:px-14 md:py-8.5"
              >
                <div className="flex items-center gap-5 md:gap-8">
                  <span
                    className="font-display text-3xl text-transparent md:text-[52px]"
                    style={{ WebkitTextStroke: "1.5px var(--ink)" }}
                  >
                    {program.index}
                  </span>
                  <span className="font-display text-lg text-ink md:text-[34px]">
                    {program.title}
                  </span>
                </div>
                <span
                  className="font-body text-xl text-ink-soft transition-transform duration-300"
                  style={{ transform: open ? "rotate(90deg)" : "none" }}
                >
                  →
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-4 pb-6 md:flex-row md:items-center md:gap-7 md:px-14 md:pb-9">
                      {/* previewImages[0] is a real gym photo; the rest are demo stock — see src/data/demo-assets.ts */}
                      <div className="relative h-24 w-full overflow-hidden border border-line md:h-24 md:w-[180px]">
                        <Image
                          src={previewImages[i].src}
                          alt={previewImages[i].alt}
                          fill
                          className="object-cover"
                          sizes="180px"
                        />
                      </div>
                      <p className="font-body text-sm text-ink-soft">{program.description}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {open && (
                <div className="h-0.5 w-[120px] bg-accent md:w-[180px] md:translate-y-0" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
