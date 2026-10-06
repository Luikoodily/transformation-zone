import { auth } from "@/auth";
import { todayUTC } from "@/lib/dates";
import { backupFileName, buildWorkbook } from "@/lib/excel";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (!(await auth())?.user) return new Response("Unauthorized", { status: 401 });

  const [members, staff] = await Promise.all([
    prisma.member.findMany({
      include: { payments: { orderBy: { paidAt: "asc" } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.staff.findMany({ orderBy: { joinedAt: "asc" } }),
  ]);

  const buffer = await buildWorkbook(members, staff);
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${backupFileName(todayUTC())}"`,
      "Cache-Control": "no-store",
    },
  });
}
