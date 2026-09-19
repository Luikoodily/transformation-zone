import Image from "next/image";
import { SectionLabel } from "@/components/ui/section-label";
import { demoAssets } from "@/data/demo-assets";

export function Gym() {
  return (
    <section id="gym" className="relative overflow-hidden border-b border-dark-line bg-dark px-6 py-16 md:px-0 md:py-[130px]">
      <div className="mb-10 max-w-[760px] px-0 md:mb-16 md:px-14">
        <SectionLabel onDark className="mb-3.5">
          The Gym
        </SectionLabel>
        <h2 className="font-display text-[34px] leading-[0.95] text-stone-text md:text-[72px] md:leading-[0.92]">
          THIS IS WHERE
          <br />
          THE WORK HAPPENS.
        </h2>
      </div>
      {/* DEMO ASSETS — pilot build, zero original business photography.
          See src/data/demo-assets.ts. */}
      <div className="relative h-[520px] md:mx-14 md:h-[480px]">
        <div className="absolute top-0 left-0 h-full w-[52%] -rotate-[0.6deg] overflow-hidden border border-dark-line">
          <Image
            src={demoAssets.gym.wide.src}
            alt={demoAssets.gym.wide.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 90vw, 52vw"
          />
        </div>
        <div className="absolute top-0 right-0 h-[46%] w-[34%] rotate-1 overflow-hidden border border-dark-line">
          <Image
            src={demoAssets.gym.equipment.src}
            alt={demoAssets.gym.equipment.alt}
            fill
            className="object-cover"
            sizes="34vw"
          />
        </div>
        <div className="absolute right-0 bottom-0 h-[46%] w-[34%] -rotate-[0.8deg] overflow-hidden border border-dark-line">
          <Image
            src={demoAssets.credentialsDetail.src}
            alt={demoAssets.credentialsDetail.alt}
            fill
            className="object-cover"
            sizes="34vw"
          />
        </div>
      </div>
    </section>
  );
}
