import { Logo } from "@/components/ui/logo";
import { location } from "@/data/location";

export function Footer() {
  return (
    <footer
      id="contact"
      className="flex flex-col gap-3 bg-paper px-6 py-8 md:flex-row md:items-center md:justify-between md:px-14 md:py-11"
    >
      <div className="flex items-center gap-2.5 md:gap-3.5">
        <Logo className="h-7 w-auto md:h-[34px]" />
        <span className="font-display text-base text-ink md:text-lg">
          {location.name.toUpperCase()}
        </span>
      </div>
      <p className="font-body text-[10.5px] text-ink-soft md:text-[11.5px]">
        © {new Date().getFullYear()} · {location.instagram} · WhatsApp · {location.whatsapp} ·{" "}
        <em>(dummy data)</em>
      </p>
    </footer>
  );
}
