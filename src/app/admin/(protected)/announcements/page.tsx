import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { AnnouncementRowActions } from "@/components/admin/announcement-row-actions";
import { EmptyState, PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/admin/ui/badge";
import { Button } from "@/components/admin/ui/button";
import { Card, CardContent } from "@/components/admin/ui/card";
import { kindLabel } from "@/lib/announcements";
import { formatDate, todayUTC } from "@/lib/dates";
import { prisma } from "@/lib/prisma";
import { deleteAnnouncement, setAnnouncementPublished } from "./actions";

export default async function AnnouncementsPage() {
  const today = todayUTC();
  const posts = await prisma.announcement.findMany({
    orderBy: { startsOn: "desc" },
    select: {
      id: true,
      kind: true,
      title: true,
      startsOn: true,
      endsOn: true,
      published: true,
      imageData: true,
    },
  });

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Website posts"
        description="Holidays, events, notices and Instagram posts shown on your public site."
        actions={
          <Button asChild>
            <Link href="/admin/announcements/new">
              <PlusIcon />
              New post
            </Link>
          </Button>
        }
      />
      <Card className="py-0">
        <CardContent className="p-0">
          {posts.length === 0 ? (
            <EmptyState
              title="Nothing posted yet"
              description="Post a holiday closure or event so members see it without calling the gym."
              action={
                <Button asChild>
                  <Link href="/admin/announcements/new">New post</Link>
                </Button>
              }
            />
          ) : (
            <ul className="divide-y">
              {posts.map((p) => {
                const over = (p.endsOn ?? p.startsOn) < today;
                return (
                  <li key={p.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 p-4">
                    {p.imageData ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`/api/admin/announcements/${p.id}/image`}
                        alt=""
                        className="size-12 rounded-md border object-cover"
                      />
                    ) : (
                      <div className="size-12 rounded-md border bg-muted" aria-hidden="true" />
                    )}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link href={`/admin/announcements/${p.id}`} className="font-medium hover:underline">
                          {p.title}
                        </Link>
                        <Badge variant="outline">{kindLabel(p.kind)}</Badge>
                        {!p.published && <Badge variant="secondary">Hidden</Badge>}
                        {over && <Badge variant="secondary">Past</Badge>}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatDate(p.startsOn)}
                        {p.endsOn ? ` – ${formatDate(p.endsOn)}` : ""}
                      </p>
                    </div>
                    <AnnouncementRowActions
                      published={p.published}
                      title={p.title}
                      onToggle={setAnnouncementPublished.bind(null, p.id)}
                      onDelete={deleteAnnouncement.bind(null, p.id)}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
