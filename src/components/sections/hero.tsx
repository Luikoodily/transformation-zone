"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { coach } from "@/data/coach";
import { demoAssets } from "@/data/demo-assets";
import { whatsappUrl } from "@/data/location";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Hero() {
  return (
    <section className="relative flex min-h-[720px] items-center justify-center overflow-hidden bg-paper-2 py-24 md:min-h-[860px]">
      <div className="absolute top-[8%] right-[4%] hidden h-[84%] w-[38%] rotate-1 overflow-hidden border border-line md:block">
        {/* DEMO ASSET — REPLACE WITH REAL BUSINESS PHOTO (see src/data/demo-assets.ts) */}
        <Image
          src={demoAssets.hero.src}
          alt={demoAssets.hero.alt}
          fill
          priority
          className="object-cover"
          sizes="38vw"
        />
      </div>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 flex w-full max-w-[1220px] flex-col px-6 md:px-14"
      >
        <motion.p variants={item} className="mb-3 font-body text-[11px] font-extrabold tracking-[0.2em] text-accent-ink uppercase md:mb-4 md:text-xs">
          {coach.name} / {coach.title}
        </motion.p>
        <div className="relative">
          <motion.div
            variants={item}
            className="w-fit bg-[repeating-linear-gradient(135deg,var(--paper-2)_0_14px,var(--paper)_14px_28px)] bg-clip-text font-display text-[64px] leading-[0.86] text-transparent [-webkit-text-stroke:1px_var(--ink)] md:text-[168px] md:leading-[0.82]"
          >
            BUILD
          </motion.div>
          <motion.div variants={item} className="font-display text-[64px] leading-[0.86] text-ink md:text-[168px] md:leading-[0.82]">
            THE
          </motion.div>
          <motion.div variants={item} className="font-display text-[64px] leading-[0.86] text-accent-ink md:text-[168px] md:leading-[0.82]">
            BODY.
          </motion.div>
        </div>
        <motion.p variants={item} className="mt-4 max-w-[480px] font-body text-sm text-ink-soft md:mt-6 md:text-[17px]">
          Personalized strength, conditioning &amp; transformation coaching with {coach.name} at
          Transformation Zone Gym.
        </motion.p>
        <motion.div variants={item} className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center md:mt-9">
          <Button href={whatsappUrl("Hi, I'd like to start training.")}>Start Training →</Button>
          <Button href="#programs" variant="outline-dark" className="!text-ink !border-ink">
            View Programs
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
