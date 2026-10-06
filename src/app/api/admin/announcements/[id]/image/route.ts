import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.announcement.findUnique({ where: { id }, select: { imageData: true, imageMime: true } });
  if (!post?.imageData || !post.imageMime) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(post.imageData), {
    headers: { "Content-Type": post.imageMime, "Cache-Control": "public, max-age=3600" },
  });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await auth())?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return Response.json({ error: "Choose an image file." }, { status: 400 });
  if (!ALLOWED.has(file.type)) return Response.json({ error: "Use a JPEG, PNG, WEBP or GIF image." }, { status: 400 });
  if (file.size > MAX_BYTES) return Response.json({ error: "Image is larger than 4 MB." }, { status: 400 });

  const result = await prisma.announcement.updateMany({
    where: { id },
    data: { imageData: Buffer.from(await file.arrayBuffer()), imageMime: file.type },
  });
  if (result.count === 0) return Response.json({ error: "This post no longer exists." }, { status: 404 });

  revalidatePath("/admin", "layout");
  revalidatePath("/");
  return Response.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await auth())?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  await prisma.announcement.updateMany({ where: { id }, data: { imageData: null, imageMime: null } });
  revalidatePath("/admin", "layout");
  revalidatePath("/");
  return Response.json({ ok: true });
}
