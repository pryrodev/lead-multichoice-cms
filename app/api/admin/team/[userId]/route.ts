import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/api";
import { getDb } from "@/lib/db";

const schema = z.object({ canManageEngagements: z.boolean(), isActive: z.boolean().optional() });

export async function PATCH(request: Request, context: { params: Promise<{ userId: string }> }) {
  const auth = await requireUser(["admin"]);
  if ("response" in auth) return auth.response;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid staff permissions." }, { status: 400 });
  const { userId } = await context.params;
  const result = await getDb().user.updateMany({
    where: { id: userId, role: "staff" },
    data: { canManageEngagements: parsed.data.canManageEngagements, ...(parsed.data.isActive === undefined ? {} : { isActive: parsed.data.isActive }) },
  });
  if (!result.count) return NextResponse.json({ error: "Staff member not found." }, { status: 404 });
  const member = await getDb().user.findUniqueOrThrow({
    where: { id: userId },
    select: { id: true, name: true, email: true, organization: true, canManageEngagements: true, isActive: true, createdAt: true },
  });
  return NextResponse.json({ member: { ...member, createdAt: member.createdAt.toISOString() } });
}
