"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { SectionLabel } from "@/components/ui/section-label";
import { methodSteps } from "@/data/method";
import { demoAssets } from "@/data/demo-assets";

export function Method() {
  return (
    <section className="flex min-h-[560px] flex-col border-y border-dark-line bg-dark md:min-h-[760px] md:flex-row">
      <div className="flex flex-col justify-center px-6 py-14 md:w-[36%] md:border-r md:border-dark-line md:py-0 md:pl-14">
        <SectionLabel onDark className="mb-3 md:mb-4.5">
          Training Philosophy
        </SectionLabel>
        <h2 className="font-display text-[44px] leading-[0.9] text-stone-text md:text-[80px] md:leading-[0.85]">
          THE
          <br />
          METHOD.
        </h2>
        {/* DEMO ASSET — REPLACE WITH REAL BUSINESS PHOTO (see src/data/demo-assets.ts) */}
        <div className="relative mt-8 hidden h-[120px] w-[160px] overflow-hidden border border-dark-line md:block">
          <Image
            src={demoAssets.methodDetail.src}
            alt={demoAssets.methodDetail.alt}
            fill
            className="object-cover opacity-80"
            sizes="160px"
          />
        </div>
      </div>
      <div className="flex flex-col gap-6 px-6 pb-14 md:w-[64%] md:justify-center md:gap-4 md:px-18 md:py-0">
        {methodSteps.map((step, i) => (
          <motion.div
            key={step.index}
            initial={{ opacity: 0.3, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-baseline gap-5"
          >
            <span
              className="font-display text-2xl text-accent md:text-[44px]"
              style={i > 0 ? { color: "transparent", WebkitTextStroke: "1.5px #6E6248" } : undefined}
            >
              {step.index}
            </span>
            <div>
              <div className="font-display text-lg text-accent md:text-2xl">{step.title}</div>
              {i === 0 && (
                <p className="mt-1 max-w-[440px] font-body text-[13px] text-[#B9AF98] md:text-base">
                  {step.description}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
