import { Button } from "@/components/ui/button";
import { whatsappUrl } from "@/data/location";

export function MobileFixedCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-line bg-paper/95 p-3 backdrop-blur-sm md:hidden">
      <Button href={whatsappUrl("Hi, I'd like to book a consultation.")} className="flex-1">
        Book
      </Button>
      <Button
        href={whatsappUrl()}
        variant="outline-dark"
        className="flex-1 !border-ink !text-ink"
      >
        WhatsApp
      </Button>
    </div>
  );
}
