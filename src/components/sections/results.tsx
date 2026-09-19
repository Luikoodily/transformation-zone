"use client";

import { useState } from "react";
import Image from "next/image";
import { SectionLabel } from "@/components/ui/section-label";
import { result } from "@/data/results";
import { demoAssets } from "@/data/demo-assets";

export function Results() {
  const [reveal, setReveal] = useState(50);

  return (
    <section id="results" className="bg-paper px-6 pb-16 md:px-14 md:pb-[130px]">
      <SectionLabel className="mb-2">Proof</SectionLabel>
      <h2 className="mb-8 font-display text-2xl text-ink md:mb-10 md:text-[52px]">
        THE RECORD.
      </h2>
      {/* DEMO ASSET — same generic photo both sides, deliberately: two different stock
          photos would visually imply a specific fabricated transformation. Replace with
          an approved, consented real before/after pair (see src/data/demo-assets.ts). */}
      <div className="relative h-[320px] overflow-hidden md:h-[600px]">
        <Image
          src={demoAssets.resultsDemo.src}
          alt={`${demoAssets.resultsDemo.alt} — before`}
          fill
          className="object-cover grayscale brightness-75"
          sizes="(max-width: 768px) 100vw, 60vw"
        />
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - reveal}% 0 0)` }}
        >
          <Image
            src={demoAssets.resultsDemo.src}
            alt={`${demoAssets.resultsDemo.alt} — after`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 60vw"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-y-0 w-0.5 bg-accent"
          style={{ left: `${reveal}%` }}
        />
        <label className="sr-only" htmlFor="before-after-slider">
          Drag to compare before and after
        </label>
        <input
          id="before-after-slider"
          type="range"
          min={0}
          max={100}
          value={reveal}
          onChange={(e) => setReveal(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
          aria-label="Drag to compare before and after"
        />
        <div className="absolute right-6 bottom-6 bg-paper/90 px-6 py-5 md:px-6 md:py-5">
          <div className="font-display text-2xl text-ink md:text-[32px]">{result.duration}</div>
          <div className="font-body text-xs text-ink-soft">
            {result.goal} · {result.client}
          </div>
        </div>
      </div>
      <p className="mt-4 font-body text-xs text-ink-soft italic">
        Dummy data — real transformation photography and consent pending.
      </p>
    </section>
  );
}
