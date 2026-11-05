import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/api";
import { getDb } from "@/lib/db";
export async function GET() {
  const auth = await requireUser(["admin"]); if ("response" in auth) return auth.response;
  try {
    const db = getDb();
    const [activeTenders, pipeline, pendingClearances, attentionItems, preference] = await Promise.all([
      db.tender.count({ where: { status: { in: ["monitoring", "preparing", "submitted"] } } }),
      db.engagement.aggregate({ where: { status: { in: ["active", "on_hold"] } }, _sum: { valueUsd: true } }),
      db.shipment.count({ where: { clearance: { not: "cleared" } } }),
      db.engagement.count({ where: { status: { in: ["active", "on_hold"] }, needsAttention: true } }),
      db.adminPreference.findUnique({ where: { userId: auth.user.id }, select: { usdToRwf: true } }),
    ]);
    return NextResponse.json({ activeTenders, pipelineUsd: Number(pipeline._sum.valueUsd ?? 0), usdToRwf: Number(preference?.usdToRwf ?? 1420), pendingClearances, attentionItems });
  } catch (error) { console.error("KPI query failed", error); return NextResponse.json({ error: "Could not load dashboard metrics." }, { status: 500 }); }
}
