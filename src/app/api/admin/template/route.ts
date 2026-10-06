import { auth } from "@/auth";
import { todayUTC } from "@/lib/dates";
import { buildWorkbook, dummyData } from "@/lib/excel";

export async function GET() {
  if (!(await auth())?.user) return new Response("Unauthorized", { status: 401 });

  const { members, staff } = dummyData(todayUTC());
  const buffer = await buildWorkbook(members, staff, { instructions: true });
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="tz-gym-import-template.xlsx"',
      "Cache-Control": "no-store",
    },
  });
}
