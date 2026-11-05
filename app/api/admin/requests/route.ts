import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/api";
import { getDb } from "@/lib/db";

export async function GET() {
  const auth = await requireUser(["admin"]);
  if ("response" in auth) return auth.response;
  try {
    const statusOrder = ["submitted", "in_review", "accepted", "declined"];
    const rows = await getDb().clientRequest.findMany({
      include: {
        submitter: { select: { id: true, name: true, email: true, organization: true, role: true } },
        engagement: { select: { id: true, reference: true, stage: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    const requests = rows
      .sort((left, right) => statusOrder.indexOf(left.status) - statusOrder.indexOf(right.status))
      .map((row) => ({
        id: row.id,
        reference: row.reference,
        requestType: row.requestType,
        title: row.title,
        category: row.category,
        targetMarket: row.targetMarket,
        details: row.details,
        status: row.status,
        createdAt: row.createdAt.toISOString(),
        clientId: row.submitter.id,
        clientName: row.submitter.name,
        clientEmail: row.submitter.email,
        organization: row.submitter.organization,
        clientRole: row.submitter.role,
        engagementId: row.engagement?.id ?? null,
        engagementReference: row.engagement?.reference ?? null,
        engagementStage: row.engagement?.stage ?? null,
        engagementStatus: row.engagement?.status ?? null,
      }));
    return NextResponse.json({ requests });
  } catch (error) {
    console.error("Admin request list failed", error);
    return NextResponse.json({ error: "Could not load client requests." }, { status: 500 });
  }
}
