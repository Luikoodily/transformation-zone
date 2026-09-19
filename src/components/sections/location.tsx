import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { Button } from "@/components/ui/button";
import { location, whatsappUrl } from "@/data/location";

export function Location() {
  return (
    <section className="relative h-[400px] border-b border-dark-line md:h-[560px]">
      <ImagePlaceholder label="Gym Exterior" dark className="absolute inset-0" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 md:flex-row md:items-end md:justify-between md:p-14">
        <div>
          <h2 className="font-display text-3xl text-stone-text md:text-[56px]">
            {location.name.toUpperCase()}
          </h2>
          <p className="mt-2 font-body text-xs text-[#B9AF98] md:mt-2.5 md:text-sm">
            {location.address} · {location.hours}
          </p>
        </div>
        <div className="flex flex-col gap-2.5 md:flex-row md:gap-3.5">
          <Button href={location.directionsUrl}>Get Directions</Button>
          <Button href={whatsappUrl()} variant="outline-dark">
            WhatsApp
          </Button>
        </div>
      </div>
    </section>
  );
}
