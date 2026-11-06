import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireEngagementPermission } from "@/lib/auth/api";
import { getDb } from "@/lib/db";

const schema = z.object({
  stage: z.enum(["connect", "introductions", "bidding", "procurement", "delivery"]).default("connect"),
  nextAction: z.string().trim().max(500).optional().default(""),
  updateTitle: z.string().trim().min(3).max(220),
  updateMessage: z.string().trim().min(10).max(5000),
});

export async function POST(request: Request, context: { params: Promise<{ requestId: string }> }) {
  const auth = await requireEngagementPermission();
  if ("response" in auth) return auth.response;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Add an update title and at least 10 characters of update detail." }, { status: 400 });
  const { requestId } = await context.params;
  const engagementId = randomBytes(16).toString("hex");
  const updateId = randomBytes(16).toString("hex");
  const reference = `LMC-ENG-${randomBytes(12).toString("hex").toUpperCase()}`;
  try {
    const result = await getDb().$transaction(async (tx) => {
      const clientRequest = await tx.clientRequest.findUnique({
        where: { id: requestId },
        include: { submitter: { select: { organization: true, role: true } }, engagement: { select: { id: true } } },
      });
      if (!clientRequest) return "missing" as const;
      if (clientRequest.engagement) return "exists" as const;
      const organization = clientRequest.organization || clientRequest.submitter?.organization || "";

      await tx.engagement.create({
        data: {
          id: engagementId,
          reference,
          requestId,
          clientUserId: clientRequest.submittedBy,
          title: clientRequest.title,
          stage: parsed.data.stage,
          buyer: clientRequest.submitter?.role === "buyer" || clientRequest.requestType === "buying" || clientRequest.requestType === "buyer_request"
            ? organization
            : "",
          supplier: clientRequest.submitter?.role === "supplier" || clientRequest.requestType === "selling" || clientRequest.requestType === "supplier_offer"
            ? organization
            : "",
          owner: auth.user.name,
          nextAction: parsed.data.nextAction || null,
          updates: {
            create: {
              id: updateId,
              authorUserId: auth.user.id,
              visibility: "client",
              updateType: "progress",
              title: parsed.data.updateTitle,
              message: parsed.data.updateMessage,
            },
          },
        },
      });
      await tx.clientRequest.update({ where: { id: requestId }, data: { status: "accepted" } });
      return "created" as const;
    });
    if (result === "missing") return NextResponse.json({ error: "Request not found." }, { status: 404 });
    if (result === "exists") return NextResponse.json({ error: "This request already has an engagement." }, { status: 409 });
    return NextResponse.json({ id: engagementId, reference }, { status: 201 });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "This request already has an engagement." }, { status: 409 });
    }
    console.error("Engagement creation failed", error);
    return NextResponse.json({ error: "Could not start the engagement." }, { status: 500 });
  }
}
