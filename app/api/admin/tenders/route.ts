import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/api";
import { getDb } from "@/lib/db";
import { dateOnly } from "@/lib/api/date";

const schema = z.object({ title: z.string().trim().min(3).max(220), entity: z.string().trim().min(2).max(200), category: z.string().max(160).default(""), portal: z.string().max(160).default(""), portalUrl: z.string().url().or(z.literal("")).default(""), deadline: z.string().max(10).default(""), valueUsd: z.number().finite().nonnegative().default(0), status: z.enum(["monitoring", "preparing", "submitted", "awarded", "lost", "cancelled"]).default("monitoring"), owner: z.string().max(160).default(""), notes: z.string().max(8000).default("") });
export async function GET() {
  const auth = await requireUser(["admin"]); if ("response" in auth) return auth.response;
  try { const rows = await getDb().tender.findMany({ orderBy: { createdAt: "desc" } }); return NextResponse.json(rows.map(({ reference, deadline, valueUsd, ...row }) => ({ ...row, ref: reference, deadline: dateOnly(deadline), valueUsd: Number(valueUsd) }))); }
  catch (error) { console.error("Tender list failed", error); return NextResponse.json({ error: "Could not load tenders." }, { status: 500 }); }
}

export async function POST(request: Request) {
  const auth = await requireUser(["admin"]); if ("response" in auth) return auth.response;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Check the tender details and try again." }, { status: 400 });
  const value = parsed.data; const id = randomBytes(16).toString("hex"); const ref = `LMC-TND-${new Date().getFullYear()}-${randomBytes(3).toString("hex").toUpperCase()}`;
  try {
    const tender = await getDb().tender.create({ data: { id, reference: ref, title: value.title, entity: value.entity, category: value.category, portal: value.portal, portalUrl: value.portalUrl, deadline: value.deadline ? new Date(`${value.deadline}T00:00:00.000Z`) : null, valueUsd: value.valueUsd, status: value.status, owner: value.owner || auth.user.name, notes: value.notes, createdBy: auth.user.id } });
    return NextResponse.json({ id: tender.id, ref: tender.reference, title: tender.title, entity: tender.entity, category: tender.category, portal: tender.portal, portalUrl: tender.portalUrl, deadline: dateOnly(tender.deadline), valueUsd: Number(tender.valueUsd), status: tender.status, owner: tender.owner, notes: tender.notes }, { status: 201 });
  } catch (error) { console.error("Tender create failed", error); return NextResponse.json({ error: "Could not save the tender." }, { status: 500 }); }
}
