import Image from "next/image";
import { testimonial } from "@/data/testimonials";
import { demoAssets } from "@/data/demo-assets";

export function Testimonial() {
  return (
    <section className="relative h-[380px] border-y border-line md:h-[520px]">
      <Image
        src={demoAssets.testimonialBackground.src}
        alt={demoAssets.testimonialBackground.alt}
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-x-4 bottom-4 flex flex-col gap-3 bg-accent p-5 shadow-[0_20px_40px_rgba(20,18,13,0.18)] md:inset-x-auto md:right-12 md:bottom-12 md:w-[460px] md:gap-4 md:p-8">
        <div className="font-display text-3xl leading-none text-ink md:text-4xl">&ldquo;</div>
        <p className="font-body text-sm leading-relaxed font-semibold text-ink md:text-base">
          {testimonial.quote}
        </p>
        <div className="flex items-center gap-2.5">
          {/* DEMO ASSET — generic portrait, not the real client (see src/data/demo-assets.ts) */}
          <div className="relative h-7 w-7 overflow-hidden rounded-full border-[3px] border-paper md:h-9 md:w-9">
            <Image
              src={demoAssets.testimonialAvatar.src}
              alt={demoAssets.testimonialAvatar.alt}
              fill
              className="object-cover"
              sizes="36px"
            />
          </div>
          <div>
            <div className="font-body text-xs font-bold text-ink md:text-[12.5px]">
              {testimonial.name}
            </div>
            <div className="font-body text-[10px] text-ink-soft md:text-[11px]">
              {testimonial.result}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
