import Image from "next/image";
import { SectionLabel } from "@/components/ui/section-label";
import { communityPosts } from "@/data/community";
import { location } from "@/data/location";

export function Community() {
  return (
    <section className="bg-paper px-6 py-14 md:px-14 md:py-[100px]">
      <div className="mb-6 flex flex-col gap-2 md:mb-9 md:flex-row md:items-end md:justify-between">
        <div>
          <SectionLabel className="mb-2">On Instagram</SectionLabel>
          <h2 className="font-display text-2xl text-ink md:text-[44px]">Straight from the gym floor.</h2>
        </div>
        <a
          href={`https://instagram.com/${location.instagram.replace("@", "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-xs font-bold text-accent-ink underline underline-offset-2"
        >
          {location.instagram} →
        </a>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
        {communityPosts.map((post) => (
          <div key={post.src} className="relative aspect-square overflow-hidden border border-line">
            <Image
              src={post.src}
              alt={post.alt}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 33vw, 50vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
