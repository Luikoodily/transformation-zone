import { AnnouncementForm } from "@/components/admin/announcement-form";
import { PageHeader } from "@/components/admin/page-header";
import { toDateInput, todayUTC } from "@/lib/dates";
import { createAnnouncement } from "../actions";

export default function NewAnnouncementPage() {
  return (
    <div className="grid max-w-3xl gap-6">
      <PageHeader
        title="New post"
        description="It appears on the public website as soon as you publish. To attach a poster image, save the post first, then upload it from the edit page."
      />
      <AnnouncementForm mode="create" today={toDateInput(todayUTC())} onSubmit={createAnnouncement} />
    </div>
  );
}
