import { coach } from "@/data/coach";

const items = [
  `${coach.yearsExperience}+ YEARS EXPERIENCE`,
  `${coach.clientsTrained} CLIENTS TRAINED`,
  "CERTIFIED COACH",
  "PERSONALIZED PROGRAMS",
];

export function TrustStrip() {
  const row = (hidden?: boolean) => (
    <div
      className="flex flex-shrink-0 items-center gap-6 pr-6 md:gap-7 md:pr-7"
      aria-hidden={hidden}
    >
      {items.map((label) => (
        <div key={label} className="flex items-center gap-6 md:gap-7">
          <span className="font-display text-sm text-ink md:text-xl">{label}</span>
          <span className="text-ink">✦</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden bg-accent py-3 md:py-4.5">
      <div className="marquee-track">
        {row()}
        {row(true)}
      </div>
    </div>
  );
}
