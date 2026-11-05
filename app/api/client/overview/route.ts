import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/api";
import { getDb } from "@/lib/db";
import { dateOnly } from "@/lib/api/date";

export async function GET() {
  const auth = await requireUser(["buyer", "supplier"]);
  if ("response" in auth) return auth.response;

  try {
    const rows = await getDb().clientRequest.findMany({
      where: { submittedBy: auth.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        engagement: {
          include: {
            milestones: { orderBy: [{ sortOrder: "asc" }, { dueDate: "asc" }] },
            updates: {
              where: { visibility: "client" },
              orderBy: { createdAt: "desc" },
              include: { author: { select: { name: true } } },
            },
          },
        },
      },
    });
    const requests = rows.map((row) => ({
      id: row.id,
      reference: row.reference,
      requestType: row.requestType,
      title: row.title,
      category: row.category,
      targetMarket: row.targetMarket,
      details: row.details,
      status: row.status,
      createdAt: row.createdAt.toISOString(),
      engagementId: row.engagement?.id ?? null,
      engagementReference: row.engagement?.reference ?? null,
      engagementStage: row.engagement?.stage ?? null,
      engagementStatus: row.engagement?.status ?? null,
      nextAction: row.engagement?.nextAction ?? null,
      nextActionDue: dateOnly(row.engagement?.nextActionDue) ?? null,
    }));
    const updates = rows.flatMap((row) => row.engagement?.updates.map((update) => ({
      id: update.id,
      engagementId: update.engagementId,
      type: update.updateType,
      title: update.title,
      message: update.message,
      createdAt: update.createdAt.toISOString(),
      authorName: update.author?.name ?? null,
    })) ?? []).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const milestones = rows.flatMap((row) => row.engagement?.milestones.map((milestone) => ({
      id: milestone.id,
      engagementId: milestone.engagementId,
      title: milestone.title,
      dueDate: dateOnly(milestone.dueDate),
      isComplete: milestone.isComplete,
    })) ?? []);
    return NextResponse.json({ requests, updates, milestones, user: auth.user });
  } catch (error) {
    console.error("Client overview query failed", error);
    return NextResponse.json({ error: "Could not load your requests." }, { status: 500 });
  }
}
