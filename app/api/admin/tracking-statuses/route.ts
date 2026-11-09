import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireEngagementPermission, requireUser } from "@/lib/auth/api";
import { getDb } from "@/lib/db";

const requestTypes = ["buyer_request", "supplier_offer", "partnership", "buying", "selling", "sourcing", "bidding", "shipping", "market_access", "other"] as const;
const createSchema = z.object({
  requestType: z.enum(requestTypes),
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().max(500).default(""),
  isTerminal: z.boolean().default(false),
});

function serializeStatus(status: {
  id: string;
  requestType: string;
  name: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  isTerminal: boolean;
}) {
  return status;
}

export async function GET() {
  const auth = await requireEngagementPermission();
  if ("response" in auth) return auth.response;
  try {
    const statuses = await getDb().trackingStatus.findMany({
      orderBy: [{ requestType: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return NextResponse.json({ statuses: statuses.map(serializeStatus) }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Tracking status list failed", error);
    return NextResponse.json({ error: "Could not load tracking statuses." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireUser(["admin"]);
  if ("response" in auth) return auth.response;
  const parsed = createSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Add a status name and request type." }, { status: 400 });
  try {
    const db = getDb();
    const last = await db.trackingStatus.findFirst({
      where: { requestType: parsed.data.requestType },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });
    const status = await db.trackingStatus.create({
      data: {
        id: randomBytes(16).toString("hex"),
        ...parsed.data,
        sortOrder: (last?.sortOrder ?? -1) + 1,
      },
    });
    return NextResponse.json({ status: serializeStatus(status) }, { status: 201 });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "That status already exists for this request type." }, { status: 409 });
    }
    console.error("Tracking status create failed", error);
    return NextResponse.json({ error: "Could not create this tracking status." }, { status: 500 });
  }
}
