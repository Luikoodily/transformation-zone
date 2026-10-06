"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { fromZodError, type ActionResult } from "@/lib/action-result";
import { parseDateInput } from "@/lib/dates";
import { prisma } from "@/lib/prisma";
import { announcementSchema, type AnnouncementInput } from "@/lib/validators";

function refresh() {
  revalidatePath("/admin", "layout");
  revalidatePath("/");
}

function toData(v: ReturnType<typeof announcementSchema.parse>) {
  return {
    kind: v.kind,
    title: v.title,
    body: v.body || null,
    startsOn: parseDateInput(v.startsOn),
    endsOn: v.endsOn ? parseDateInput(v.endsOn) : null,
    link: v.link || null,
    imageUrl: v.imageUrl || null,
    published: v.published,
  };
}

export async function createAnnouncement(values: AnnouncementInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = announcementSchema.safeParse(values);
  if (!parsed.success) return fromZodError(parsed.error);
  await prisma.announcement.create({ data: toData(parsed.data) });
  refresh();
  redirect("/admin/announcements");
}

export async function updateAnnouncement(id: string, values: AnnouncementInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = announcementSchema.safeParse(values);
  if (!parsed.success) return fromZodError(parsed.error);
  const result = await prisma.announcement.updateMany({ where: { id }, data: toData(parsed.data) });
  if (result.count === 0) return { ok: false, message: "This post no longer exists." };
  refresh();
  redirect("/admin/announcements");
}

export async function setAnnouncementPublished(id: string, published: boolean): Promise<ActionResult> {
  await requireAdmin();
  await prisma.announcement.updateMany({ where: { id }, data: { published } });
  refresh();
  return { ok: true, message: published ? "Now visible on the website" : "Hidden from the website" };
}

export async function deleteAnnouncement(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.announcement.deleteMany({ where: { id } });
  refresh();
  return { ok: true, message: "Post deleted" };
}
