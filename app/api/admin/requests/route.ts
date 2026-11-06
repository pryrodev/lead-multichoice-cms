import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireEngagementPermission } from "@/lib/auth/api";
import { getDb } from "@/lib/db";

const createSchema = z.object({
  clientName: z.string().trim().min(2).max(160),
  organization: z.string().trim().max(200).default(""),
  clientEmail: z.union([z.string().trim().email().max(254), z.literal("")]).optional().default(""),
  clientPhone: z.string().trim().max(40).optional().default(""),
  requestType: z.enum(["buyer_request", "supplier_offer", "partnership", "buying", "selling", "sourcing", "bidding", "shipping", "market_access", "other"]),
  title: z.string().trim().min(5).max(220),
  category: z.string().trim().min(2).max(160),
  targetMarket: z.string().trim().min(2).max(160).default("Rwanda"),
  details: z.string().trim().min(20).max(8000),
  stage: z.enum(["connect", "introductions", "bidding", "procurement", "delivery"]).default("connect"),
  nextAction: z.string().trim().max(500).optional().default(""),
  updateTitle: z.string().trim().min(3).max(220),
  updateMessage: z.string().trim().min(10).max(5000),
});

export async function GET() {
  const auth = await requireEngagementPermission();
  if ("response" in auth) return auth.response;
  try {
    const statusOrder = ["submitted", "in_review", "accepted", "declined"];
    const rows = await getDb().clientRequest.findMany({
      include: {
        submitter: { select: { id: true, name: true, email: true, phone: true, organization: true, role: true } },
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
        clientId: row.submittedBy,
        clientName: row.clientName || row.submitter?.name || "Client",
        clientEmail: row.clientEmail ?? row.submitter?.email ?? null,
        clientPhone: row.clientPhone ?? row.submitter?.phone ?? null,
        organization: row.organization || row.submitter?.organization || "",
        clientRole: row.submitter?.role ?? "external",
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

export async function POST(request: Request) {
  const auth = await requireEngagementPermission();
  if ("response" in auth) return auth.response;
  const parsed = createSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Complete the client and request details before saving." }, { status: 400 });

  const input = parsed.data;
  const requestId = randomBytes(16).toString("hex");
  const engagementId = randomBytes(16).toString("hex");
  const requestReference = `LMC-REQ-${randomBytes(12).toString("hex").toUpperCase()}`;
  const engagementReference = `LMC-ENG-${randomBytes(12).toString("hex").toUpperCase()}`;
  try {
    await getDb().$transaction(async (tx) => {
      await tx.clientRequest.create({
        data: {
          id: requestId,
          reference: requestReference,
          submittedBy: null,
          clientName: input.clientName,
          clientEmail: input.clientEmail || null,
          clientPhone: input.clientPhone || null,
          organization: input.organization,
          requestType: input.requestType,
          title: input.title,
          category: input.category,
          targetMarket: input.targetMarket,
          details: input.details,
          status: "accepted",
        },
      });
      await tx.engagement.create({
        data: {
          id: engagementId,
          reference: engagementReference,
          requestId,
          clientUserId: null,
          title: input.title,
          stage: input.stage,
          owner: auth.user.name,
          buyer: input.requestType === "buying" || input.requestType === "buyer_request" ? input.organization : "",
          supplier: input.requestType === "selling" || input.requestType === "supplier_offer" ? input.organization : "",
          nextAction: input.nextAction || null,
          updates: {
            create: {
              id: randomBytes(16).toString("hex"),
              authorUserId: auth.user.id,
              visibility: "client",
              updateType: "progress",
              title: input.updateTitle,
              message: input.updateMessage,
            },
          },
        },
      });
    });
    return NextResponse.json({ id: requestId, reference: requestReference, engagementId }, { status: 201 });
  } catch (error) {
    console.error("Admin guest request creation failed", error);
    return NextResponse.json({ error: "Could not create this client request." }, { status: 500 });
  }
}
