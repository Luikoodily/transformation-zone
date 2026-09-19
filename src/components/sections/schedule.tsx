import { SectionLabel } from "@/components/ui/section-label";
import { schedule } from "@/data/location";

export function Schedule() {
  return (
    <section className="bg-paper px-6 pb-14 md:px-14 md:pb-[120px]">
      <SectionLabel className="mb-2">Hours</SectionLabel>
      <h2 className="mb-6 font-display text-2xl text-ink md:mb-8 md:text-[44px]">
        When you can train.
      </h2>

      {/* Mobile: horizontal day rail */}
      <div className="-mx-6 flex gap-2 overflow-x-auto px-6 md:hidden">
        {schedule.map((day) => (
          <div key={day.day} className="min-w-[120px] flex-shrink-0 border border-line">
            <div
              className={`py-2.5 text-center font-body text-xs font-bold ${
                day.day === "SUN" ? "bg-accent text-ink" : "bg-paper-2 text-ink"
              }`}
            >
              {day.day}
            </div>
            <div className="py-2.5 text-center font-body text-[11px] font-bold text-ink-soft">
              {day.opens}
            </div>
            <div className="border-t border-line py-2.5 text-center font-body text-[11px] font-bold text-ink-soft">
              {day.closes}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: full week grid */}
      <div className="hidden border border-line md:grid md:grid-cols-8">
        <div className="border-r border-b border-line bg-paper-2 p-3.5" />
        {schedule.map((day) => (
          <div
            key={day.day}
            className={`border-r border-b border-line p-3.5 text-center font-body text-sm font-bold last:border-r-0 ${
              day.day === "SUN" ? "bg-accent text-ink" : "bg-paper-2 text-ink"
            }`}
          >
            {day.day}
          </div>
        ))}

        <div className="border-r border-b border-line p-3.5 font-body text-sm">Opens</div>
        {schedule.map((day) => (
          <div
            key={`${day.day}-opens`}
            className="border-r border-b border-line p-3.5 text-center font-body text-xs font-bold text-ink last:border-r-0"
          >
            {day.opens}
          </div>
        ))}

        <div className="border-r border-b border-line p-3.5 font-body text-sm">Closes</div>
        {schedule.map((day) => (
          <div
            key={`${day.day}-closes`}
            className="border-r border-b border-line p-3.5 text-center font-body text-xs font-bold text-ink last:border-r-0"
          >
            {day.closes}
          </div>
        ))}
      </div>
      <p className="mt-3.5 font-body text-[11.5px] text-ink-soft italic">
        Sunday hours differ — 5 PM to 9 PM.
      </p>
    </section>
  );
}
