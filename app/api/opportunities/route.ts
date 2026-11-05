import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/api";
import { getDb } from "@/lib/db";
import { dateOnly } from "@/lib/api/date";
import type { Opportunity as DbOpportunity } from "@/generated/prisma/client";

const serializeOpportunity = (item: DbOpportunity) => ({
  ...item,
  ref: item.reference,
  externalRef: item.externalReference,
  publishedAt: dateOnly(item.publishedAt) ?? "",
  deadline: dateOnly(item.deadline) ?? "",
  estimatedValue: item.estimatedValue === null ? null : Number(item.estimatedValue),
  nextActionDue: dateOnly(item.nextActionDue) ?? "",
  createdAt: item.createdAt.toISOString(),
});

const schema = z.object({
  title: z.string().trim().min(3).max(220),
  type: z.enum(["public_tender", "institutional_procurement", "direct_buyer_requirement", "supplier_led", "other"]),
  buyer: z.string().max(200).default(""),
  source: z.string().max(200).default(""),
  sourceUrl: z.string().max(1000).default(""),
  externalRef: z.string().max(120).default(""),
  country: z.string().max(120).default(""),
  sector: z.string().max(160).default(""),
  description: z.string().max(8000).default(""),
  requirements: z.string().max(8000).default(""),
  publishedAt: z.string().max(10).default(""),
  deadline: z.string().max(10).default(""),
  estimatedValue: z.number().finite().nonnegative().nullable(),
  potentialSupplier: z.string().max(200).default(""),
  owner: z.string().trim().max(160).default(""),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  status: z.enum(["new", "under_assessment", "qualified", "pursuing", "monitoring", "awaiting_information", "preparing_submission", "submitted", "under_evaluation", "awarded", "not_awarded", "withdrawn", "closed"]).default("new"),
  nextAction: z.string().max(500).default(""),
  nextActionDue: z.string().max(10).default(""),
  closureReason: z.string().max(8000).default(""),
});

export async function GET() {
  const auth = await requireUser(["admin"]);
  if ("response" in auth) return auth.response;
  try {
    const rows = await getDb().opportunity.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(rows.map(serializeOpportunity));
  } catch (error) {
    console.error("Opportunity list failed", error);
    return NextResponse.json({ error: "Could not load opportunities." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireUser(["admin"]);
  if ("response" in auth) return auth.response;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Check the opportunity details and try again." }, { status: 400 });
  const input = parsed.data;
  const id = randomBytes(16).toString("hex");
  const ref = `LMC-OPP-${new Date().getFullYear()}-${randomBytes(3).toString("hex").toUpperCase()}`;
  try {
    const opportunity = await getDb().opportunity.create({
      data: {
        id,
        reference: ref,
        title: input.title,
        type: input.type,
        buyer: input.buyer,
        source: input.source,
        sourceUrl: input.sourceUrl,
        externalReference: input.externalRef,
        country: input.country,
        sector: input.sector,
        description: input.description,
        requirements: input.requirements,
        publishedAt: input.publishedAt ? new Date(`${input.publishedAt}T00:00:00.000Z`) : null,
        deadline: input.deadline ? new Date(`${input.deadline}T00:00:00.000Z`) : null,
        estimatedValue: input.estimatedValue,
        potentialSupplier: input.potentialSupplier,
        owner: input.owner || auth.user.name,
        priority: input.priority,
        status: input.status,
        nextAction: input.nextAction,
        nextActionDue: input.nextActionDue ? new Date(`${input.nextActionDue}T00:00:00.000Z`) : null,
        closureReason: input.closureReason,
        createdBy: auth.user.id,
      },
    });
    return NextResponse.json(serializeOpportunity(opportunity), { status: 201 });
  } catch (error) {
    console.error("Opportunity create failed", error);
    return NextResponse.json({ error: "Could not save this opportunity." }, { status: 500 });
  }
}
