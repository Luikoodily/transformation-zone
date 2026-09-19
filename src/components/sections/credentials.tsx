import { SectionLabel } from "@/components/ui/section-label";
import { credentials } from "@/data/credentials";

export function Credentials() {
  return (
    <section className="bg-paper px-6 py-12 md:px-14 md:py-16">
      <SectionLabel className="mb-4">Credibility</SectionLabel>
      <h2 className="mb-6 font-display text-[26px] text-ink md:text-[34px]">CERTIFIED.</h2>
      <div className="flex flex-wrap gap-2 md:gap-4">
        {credentials.map((c) => (
          <span
            key={c}
            className="rounded-full border border-line px-3.5 py-2.5 font-body text-xs font-bold text-ink md:px-6 md:py-4 md:text-sm"
          >
            → {c}
          </span>
        ))}
      </div>
    </section>
  );
}
