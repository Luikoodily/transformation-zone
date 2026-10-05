import { SectionLabel } from "@/components/ui/section-label";
import { groupClasses } from "@/data/classes";
import { services } from "@/data/services";

export function Classes() {
  return (
    <section className="bg-paper px-6 pb-14 md:px-14 md:pb-[120px]">
      <SectionLabel className="mb-2">Group Classes</SectionLabel>
      <h2 className="mb-6 font-display text-2xl text-ink md:mb-8 md:text-[44px]">
        Unisex gym. Fitness for every body.
      </h2>

      <div className="grid gap-3 md:grid-cols-2 md:gap-4">
        {groupClasses.map((c) => (
          <div key={c.name} className="border border-line bg-paper-2 p-6 md:p-7">
            <p className="font-display text-xl text-accent-ink md:text-2xl">{c.name}</p>
            <p className="mt-1 font-body text-sm font-bold text-ink">{c.days}</p>
            <p className="font-body text-xs text-ink-soft md:text-sm">{c.time}</p>
          </div>
        ))}
      </div>

      <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 md:mt-8">
        {services.map((s) => (
          <li
            key={s}
            className="font-body text-[11.5px] font-bold tracking-wide text-ink-soft uppercase before:mr-1.5 before:text-accent-ink before:content-['●']"
          >
            {s}
          </li>
        ))}
      </ul>
    </section>
  );
}
