import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/api";
import { getDb } from "@/lib/db";
const profileSchema = z.object({ name: z.string().trim().min(2).max(160), email: z.string().trim().email().max(254), phone: z.string().trim().max(40).default("") });

export async function GET() {
  const auth = await requireUser(["admin"]); if ("response" in auth) return auth.response;
  try { const profile = await getDb().user.findUnique({ where: { id: auth.user.id }, select: { name: true, email: true, phone: true } }); return NextResponse.json(profile ? { ...profile, phone: profile.phone ?? "", role: "Operations Manager" } : null); }
  catch (error) { console.error("Profile read failed", error); return NextResponse.json({ error: "Could not load your profile." }, { status: 500 }); }
}
export async function PUT(request: Request) {
  const auth = await requireUser(["admin"]); if ("response" in auth) return auth.response;
  const parsed = profileSchema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ error: "Check your name, email, and phone number." }, { status: 400 });
  try { const profile = await getDb().user.update({ where: { id: auth.user.id }, data: { name: parsed.data.name, email: parsed.data.email, phone: parsed.data.phone || null }, select: { name: true, email: true, phone: true } }); return NextResponse.json({ ...profile, phone: profile.phone ?? "", role: "Operations Manager" }); }
  catch (error) { console.error("Profile update failed", error); return NextResponse.json({ error: "Could not update your profile. The email may already be in use." }, { status: 409 }); }
}
