import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireEngagementPermission } from "@/lib/auth/api";
import { getDb } from "@/lib/db";

const schema = z.object({
  title: z.string().trim().min(3).max(220),
  message: z.string().trim().min(10).max(5000),
  type: z.enum(["progress", "milestone", "document", "decision", "blocker"]).default("progress"),
  stage: z.enum(["connect", "introductions", "bidding", "procurement", "delivery"]).optional(),
  nextAction: z.string().trim().max(500).optional(),
});

export async function POST(request: Request, context: { params: Promise<{ engagementId: string }> }) {
  const auth = await requireEngagementPermission();
  if ("response" in auth) return auth.response;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Add a clear title and at least 10 characters of update detail." }, { status: 400 });
  const { engagementId } = await context.params;
  try {
    const created = await getDb().$transaction(async (tx) => {
      const engagement = await tx.engagement.findUnique({ where: { id: engagementId }, select: { id: true } });
      if (!engagement) return false;
      await tx.engagementUpdate.create({
        data: {
          id: randomBytes(16).toString("hex"),
          engagementId,
          authorUserId: auth.user.id,
          visibility: "client",
          updateType: parsed.data.type,
          title: parsed.data.title,
          message: parsed.data.message,
        },
      });
      const data = {
        ...(parsed.data.stage ? { stage: parsed.data.stage } : {}),
        ...(parsed.data.nextAction !== undefined ? { nextAction: parsed.data.nextAction || null } : {}),
      };
      if (Object.keys(data).length) await tx.engagement.update({ where: { id: engagementId }, data });
      return true;
    });
    if (!created) return NextResponse.json({ error: "Engagement not found." }, { status: 404 });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Engagement update failed", error);
    return NextResponse.json({ error: "Could not post the engagement update." }, { status: 500 });
  }
}
