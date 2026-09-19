import { Fragment } from "react";
import { SectionLabel } from "@/components/ui/section-label";
import { schedule } from "@/data/location";

export function Schedule() {
  return (
    <section className="bg-paper px-6 pb-14 md:px-14 md:pb-[120px]">
      <SectionLabel className="mb-2">Availability</SectionLabel>
      <h2 className="mb-6 font-display text-2xl text-ink md:mb-8 md:text-[44px]">
        When you can train.
      </h2>

      {/* Mobile: horizontal day rail */}
      <div className="-mx-6 flex gap-2 overflow-x-auto px-6 md:hidden">
        {schedule.map((day) => (
          <div key={day.day} className="min-w-[120px] flex-shrink-0 border border-line">
            <div className="bg-paper-2 py-2.5 text-center font-body text-xs font-bold">
              {day.day}
            </div>
            {day.slots.map((slot) => (
              <div
                key={slot.time}
                className={`py-2.5 text-center font-body text-[11px] font-bold ${
                  slot.open ? "bg-accent text-ink" : "text-ink-soft"
                }`}
              >
                {slot.time} · {slot.open ? "1:1" : "Closed"}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Desktop: full week grid */}
      <div className="hidden border border-line md:grid md:grid-cols-7">
        <div className="border-r border-b border-line bg-paper-2 p-3.5" />
        {schedule.map((day) => (
          <div
            key={day.day}
            className="border-r border-b border-line bg-paper-2 p-3.5 text-center font-body text-sm font-bold last:border-r-0"
          >
            {day.day}
          </div>
        ))}
        {[0, 1].map((slotIdx) => (
          <Fragment key={`slot-${slotIdx}`}>
            <div className="border-r border-b border-line p-3.5 font-body text-sm">
              {schedule[0].slots[slotIdx].time}
            </div>
            {schedule.map((day) => (
              <div
                key={`${day.day}-${slotIdx}`}
                className={`border-r border-b border-line p-3.5 text-center font-body text-xs font-bold last:border-r-0 ${
                  day.slots[slotIdx].open ? "bg-accent text-ink" : "text-ink-soft"
                }`}
              >
                {day.slots[slotIdx].open ? "1:1" : "—"}
              </div>
            ))}
          </Fragment>
        ))}
      </div>
      <p className="mt-3.5 font-body text-[11.5px] text-ink-soft italic">
        Placeholder schedule — real 1:1 slot availability replaces this before launch.
      </p>
    </section>
  );
}
