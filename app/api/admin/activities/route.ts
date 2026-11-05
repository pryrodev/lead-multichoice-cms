import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/api";
import { getDb } from "@/lib/db";

const schema = z.object({ kind: z.enum(["update", "blocker", "next_action", "decision"]), ref: z.string().trim().min(1).max(32), message: z.string().trim().min(2).max(4000) });
export async function GET() {
  const auth = await requireUser(["admin"]); if ("response" in auth) return auth.response;
  try {
    const rows = await getDb().activityEntry.findMany({ orderBy: { createdAt: "desc" }, take: 200, include: { author: { select: { name: true } } } });
    return NextResponse.json(rows.map(({ author, createdAt, reference, ...row }) => ({ ...row, ref: reference, author: author.name, at: createdAt.toISOString() })));
  } catch (error) { console.error("Activity list failed", error); return NextResponse.json({ error: "Could not load activity." }, { status: 500 }); }
}
export async function POST(request: Request) {
  const auth = await requireUser(["admin"]); if ("response" in auth) return auth.response;
  const parsed = schema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ error: "Add a reference and a message." }, { status: 400 });
  const { kind, ref, message } = parsed.data; const id = randomBytes(16).toString("hex");
  try {
    await getDb().activityEntry.create({ data: { id, kind, reference: ref, message, authorUserId: auth.user.id } });
    return NextResponse.json({ id, at: new Date().toISOString(), kind, ref, author: auth.user.name, message }, { status: 201 });
  } catch (error) { console.error("Activity insert failed", error); return NextResponse.json({ error: "Could not save the activity entry." }, { status: 500 }); }
}
