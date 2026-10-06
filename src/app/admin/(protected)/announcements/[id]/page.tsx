import { notFound } from "next/navigation";
import { AnnouncementImage } from "@/components/admin/announcement-image";
import { AnnouncementForm } from "@/components/admin/announcement-form";
import { PageHeader } from "@/components/admin/page-header";
import { toDateInput, todayUTC } from "@/lib/dates";
import { prisma } from "@/lib/prisma";
import { updateAnnouncement } from "../actions";

export default async function EditAnnouncementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const a = await prisma.announcement.findUnique({ where: { id } });
  if (!a) notFound();
  return (
    <div className="grid max-w-3xl gap-6">
      <PageHeader title="Edit post" />
      <AnnouncementImage id={a.id} hasImage={!!a.imageData} />
      <AnnouncementForm
        mode="edit"
        today={toDateInput(todayUTC())}
        defaults={{
          kind: a.kind,
          title: a.title,
          body: a.body ?? "",
          startsOn: toDateInput(a.startsOn),
          endsOn: a.endsOn ? toDateInput(a.endsOn) : "",
          link: a.link ?? "",
          imageUrl: a.imageUrl ?? "",
          published: a.published,
        }}
        onSubmit={updateAnnouncement.bind(null, a.id)}
      />
    </div>
  );
}
