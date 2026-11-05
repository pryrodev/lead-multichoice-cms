import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/api";
import { getDb } from "@/lib/db";
const schema = z.object({ usdToRwf: z.number().finite().positive().max(100000), deadlineWarningDays: z.number().int().positive().max(365), emailAlerts: z.boolean(), blockerAlerts: z.boolean(), weeklyDigest: z.boolean() });
const defaults = { usdToRwf: 1420, deadlineWarningDays: 7, emailAlerts: true, blockerAlerts: true, weeklyDigest: false };
export async function GET() {
  const auth = await requireUser(["admin"]); if ("response" in auth) return auth.response;
  try { const row = await getDb().adminPreference.findUnique({ where: { userId: auth.user.id } }); return NextResponse.json(row ? { ...row, usdToRwf: Number(row.usdToRwf) } : defaults); }
  catch (error) { console.error("Settings read failed", error); return NextResponse.json({ error: "Could not load settings." }, { status: 500 }); }
}
export async function PUT(request: Request) {
  const auth = await requireUser(["admin"]); if ("response" in auth) return auth.response;
  const parsed = schema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ error: "Check the preference values and try again." }, { status: 400 });
  const s = parsed.data;
  try { await getDb().adminPreference.upsert({ where: { userId: auth.user.id }, create: { userId: auth.user.id, ...s }, update: s }); return NextResponse.json(s); }
  catch (error) { console.error("Settings update failed", error); return NextResponse.json({ error: "Could not save settings." }, { status: 500 }); }
}
