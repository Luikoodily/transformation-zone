import { SectionLabel } from "@/components/ui/section-label";
import { Button } from "@/components/ui/button";
import { whatsappUrl } from "@/data/location";

export function FinalCTA() {
  return (
    <section
      id="start"
      className="flex flex-col items-center gap-5 bg-dark px-6 py-20 text-center md:gap-6.5 md:py-[170px]"
    >
      <SectionLabel onDark>Start Today</SectionLabel>
      <h2 className="font-display text-[46px] leading-[0.9] text-stone-text md:text-[60px] md:leading-[0.88]">
        READY
        <br />
        TO
        <br />
        START?
      </h2>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row md:mt-3.5 md:gap-4">
        <Button href={whatsappUrl("Hi, I'd like to book a consultation.")}>
          Book a Consultation
        </Button>
        <Button href={whatsappUrl()} variant="outline-dark">
          WhatsApp
        </Button>
      </div>
    </section>
  );
}
