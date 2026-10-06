import { SectionLabel } from "@/components/ui/section-label";
import { location } from "@/data/location";
import { todayUTC } from "@/lib/dates";
import { prisma } from "@/lib/prisma";

async function loadPosts() {
  try {
    const today = todayUTC();
    const posts = await prisma.announcement.findMany({
      where: { published: true, imageData: { not: null } },
      orderBy: { startsOn: "desc" },
      select: { id: true, title: true, startsOn: true, endsOn: true },
    });
    // Evergreen posts (no end date) stay up; anything with an end date that
    // has passed drops off on its own — no admin cleanup needed.
    return posts.filter((p) => p.endsOn === null || p.endsOn >= today).slice(0, 6);
  } catch {
    return [];
  }
}

export async function InstagramFeed() {
  const posts = await loadPosts();
  if (posts.length === 0) return null;

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
        {posts.map((post) => (
          <div key={post.id} className="relative aspect-square overflow-hidden border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element -- served from our own DB-backed route */}
            <img
              src={`/api/admin/announcements/${post.id}/image`}
              alt={post.title}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
