import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/api";
import { getDb } from "@/lib/db";
import { dateOnly } from "@/lib/api/date";

const schema = z.object({ cargo: z.string().trim().min(2).max(220), corridor: z.string().max(180).default(""), origin: z.string().trim().min(2).max(160), destination: z.string().trim().min(2).max(160), progress: z.number().int().min(0).max(100).default(0), eta: z.string().max(10).default(""), clearance: z.enum(["pending", "in_review", "cleared", "held"]).default("pending"), milestones: z.array(z.object({ label: z.string().trim().min(1).max(220), date: z.string().max(10).nullable(), done: z.boolean() })).max(30).default([]) });
export async function GET() {
  const auth = await requireUser(["admin"]); if ("response" in auth) return auth.response;
  try {
    const shipments = await getDb().shipment.findMany({ orderBy: { createdAt: "desc" }, include: { milestones: { orderBy: { sortOrder: "asc" } } } });
    return NextResponse.json(shipments.map((shipment) => ({
      id: shipment.id,
      ref: shipment.reference,
      cargo: shipment.cargo,
      corridor: shipment.corridor,
      origin: shipment.origin,
      destination: shipment.destination,
      progress: shipment.progress,
      eta: dateOnly(shipment.eta),
      clearance: shipment.clearance,
      milestones: shipment.milestones.map((milestone) => ({ label: milestone.label, date: dateOnly(milestone.eventDate), done: milestone.isComplete })),
    })));
  } catch (error) { console.error("Shipment list failed", error); return NextResponse.json({ error: "Could not load shipments." }, { status: 500 }); }
}
export async function POST(request: Request) {
  const auth = await requireUser(["admin"]); if ("response" in auth) return auth.response;
  const parsed = schema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ error: "Check the shipment details and try again." }, { status: 400 });
  const value = parsed.data; const id = randomBytes(16).toString("hex"); const ref = `LMC-SHP-${new Date().getFullYear()}-${randomBytes(3).toString("hex").toUpperCase()}`;
  try {
    await getDb().shipment.create({
      data: {
        id,
        reference: ref,
        cargo: value.cargo,
        corridor: value.corridor,
        origin: value.origin,
        destination: value.destination,
        progress: value.progress,
        eta: value.eta ? new Date(`${value.eta}T00:00:00.000Z`) : null,
        clearance: value.clearance,
        createdBy: auth.user.id,
        milestones: { create: value.milestones.map((milestone, index) => ({ id: randomBytes(16).toString("hex"), label: milestone.label, eventDate: milestone.date ? new Date(`${milestone.date}T00:00:00.000Z`) : null, isComplete: milestone.done, sortOrder: index })) },
      },
    });
    return NextResponse.json({ id, ref, ...value }, { status: 201 });
  } catch (error) { console.error("Shipment create failed", error); return NextResponse.json({ error: "Could not save the shipment." }, { status: 500 }); }
}
