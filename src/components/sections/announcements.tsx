import { SectionLabel } from "@/components/ui/section-label";
import { kindLabel } from "@/lib/announcements";
import { formatDate, todayUTC } from "@/lib/dates";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

async function loadCurrent() {
  try {
    const today = todayUTC();
    const posts = await prisma.announcement.findMany({
      where: { published: true },
      orderBy: { startsOn: "asc" },
      select: {
        id: true,
        kind: true,
        title: true,
        body: true,
        startsOn: true,
        endsOn: true,
        link: true,
        imageUrl: true,
        imageData: true,
      },
    });
    return posts.filter((p) => (p.endsOn ?? p.startsOn) >= today).slice(0, 6);
  } catch {
    return [];
  }
}

export async function Announcements() {
  const posts = await loadCurrent();
  if (posts.length === 0) return null;

  // A 3-column grid with one lonely card looks broken, so a single post gets
  // a wide banner layout instead of being stranded in a sea of whitespace.
  const single = posts.length === 1;

  return (
    <section id="updates" className="bg-paper px-6 py-12 md:px-14 md:py-[90px]">
      <SectionLabel className="mb-2">Latest updates</SectionLabel>
      <h2 className="mb-6 font-display text-2xl text-ink md:mb-8 md:text-[44px]">Holidays, events &amp; news.</h2>
      <div
        className={cn(
          "grid gap-3 md:gap-4",
          single ? "" : posts.length === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"
        )}
      >
        {posts.map((p) => {
          const imageSrc = p.imageData ? `/api/admin/announcements/${p.id}/image` : p.imageUrl;
          return (
            <article
              key={p.id}
              className={cn(
                "flex overflow-hidden border border-line bg-paper-2",
                single ? "flex-col md:flex-row" : "flex-col"
              )}
            >
              {imageSrc && (
                // eslint-disable-next-line @next/next/no-img-element -- admin-supplied image, arbitrary origin
                <img
                  src={imageSrc}
                  alt=""
                  loading="lazy"
                  className={cn(
                    "object-cover",
                    single ? "aspect-[16/9] w-full md:aspect-auto md:w-2/5" : "aspect-[16/9] w-full"
                  )}
                />
              )}
              <div className="flex flex-1 flex-col gap-2 p-5 md:p-7">
                <p className="font-body text-[11px] font-extrabold tracking-[0.18em] text-accent-ink uppercase">
                  {kindLabel(p.kind)} · {formatDate(p.startsOn)}
                  {p.endsOn ? ` – ${formatDate(p.endsOn)}` : ""}
                </p>
                <h3 className={cn("font-display text-ink", single ? "text-2xl md:text-3xl" : "text-xl md:text-2xl")}>
                  {p.title}
                </h3>
                {p.body && <p className="font-body text-sm text-ink-soft">{p.body}</p>}
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto w-fit pt-2 font-body text-xs font-bold text-accent-ink underline underline-offset-2"
                  >
                    {p.kind === "INSTAGRAM" ? "View on Instagram →" : "Learn more →"}
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
