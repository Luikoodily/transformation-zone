import Image from "next/image";
import { SectionLabel } from "@/components/ui/section-label";
import { coach } from "@/data/coach";
import { demoAssets } from "@/data/demo-assets";

export function Coach() {
  return (
    <section id="about" className="px-6 py-20 md:px-14 md:py-[150px]">
      <div className="grid gap-10 md:grid-cols-[5fr_6fr] md:items-center md:gap-16">
        <div className="relative h-[340px] md:h-[620px]">
          {/* DEMO ASSET — REPLACE WITH REAL BUSINESS PHOTO (see src/data/demo-assets.ts) */}
          <div className="absolute top-0 left-0 h-[82%] w-[82%] overflow-hidden border border-line">
            <Image
              src={demoAssets.coachPortrait.src}
              alt={demoAssets.coachPortrait.alt}
              fill
              className="object-cover grayscale"
              sizes="(max-width: 768px) 82vw, 41vw"
            />
          </div>
          {/* DEMO ASSET — REPLACE WITH REAL BUSINESS PHOTO */}
          <div className="absolute right-0 bottom-0 h-[44%] w-[44%] overflow-hidden border border-accent">
            <Image
              src={demoAssets.coachTraining.src}
              alt={demoAssets.coachTraining.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 44vw, 22vw"
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 md:gap-5.5">
          <SectionLabel>The Coach</SectionLabel>
          <h2 className="font-display text-[42px] leading-[0.92] text-ink md:text-[76px]">
            TRAIN WITH
            <br />
            PURPOSE.
          </h2>
          <p className="font-body text-sm text-ink-soft md:text-[17px]">
            {coach.bio[0]}
          </p>
          <div className="flex flex-wrap gap-2.5">
            {coach.specialties.map((s) => (
              <span
                key={s}
                className="rounded-full border border-line px-4 py-2 font-body text-[11px] font-bold tracking-wider text-ink uppercase"
              >
                {s}
              </span>
            ))}
          </div>
          {/* DEMO ASSETS — REPLACE WITH REAL BUSINESS PHOTOS (see src/data/demo-assets.ts) */}
          <div className="mt-2 flex items-center gap-3">
            {demoAssets.sessionMoments.map((moment) => (
              <div
                key={moment.src}
                className="relative h-16 w-16 overflow-hidden rounded-full border-[3px] border-accent md:h-[88px] md:w-[88px]"
              >
                <Image src={moment.src} alt={moment.alt} fill className="object-cover" sizes="88px" />
              </div>
            ))}
            <span className="font-body text-[10px] text-ink-soft md:text-[11px]">
              Session moments
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
