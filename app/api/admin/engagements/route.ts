import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/api";
import { getDb } from "@/lib/db";
import { dateOnly } from "@/lib/api/date";

export async function GET() {
  const auth = await requireUser(["admin"]);
  if ("response" in auth) return auth.response;
  try {
    const engagements = await getDb().engagement.findMany({
      where: { status: { in: ["active", "on_hold"] } },
      orderBy: { updatedAt: "desc" },
      include: {
        client: { select: { organization: true, role: true } },
        milestones: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
      },
    });
    return NextResponse.json(engagements.map((engagement) => ({
      id: engagement.id,
      ref: engagement.reference,
      title: engagement.title,
      stage: engagement.stage,
      valueUsd: Number(engagement.valueUsd ?? 0),
      buyer: engagement.buyer || (engagement.client.role === "buyer" ? engagement.client.organization : ""),
      supplier: engagement.supplier || (engagement.client.role === "supplier" ? engagement.client.organization : ""),
      owner: engagement.owner,
      priority: engagement.priority,
      needsAttention: engagement.needsAttention,
      nextAction: engagement.nextAction ?? "",
      milestones: engagement.milestones.map((milestone) => ({ title: milestone.title, due: dateOnly(milestone.dueDate) ?? "", done: milestone.isComplete })),
    })));
  } catch (error) {
    console.error("Admin engagement list failed", error);
    return NextResponse.json({ error: "Could not load engagements." }, { status: 500 });
  }
}
