import Image from "next/image";

// Real brand mark, cropped from the gym's own flyer artwork (public/images/brand).
export function Logo({ className }: { className?: string }) {
  return (
    <span className={`relative inline-block ${className ?? ""}`} style={{ aspectRatio: "460 / 220" }}>
      <Image
        src="/images/brand/tz-icon.png"
        alt="Transformation Zone logo"
        fill
        className="object-contain"
        sizes="200px"
        priority
      />
    </span>
  );
}
