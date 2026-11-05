import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/api";
import { getDb } from "@/lib/db";

const requestSchema = z.object({
  requestType: z.enum(["buyer_request", "supplier_offer", "partnership"]),
  title: z.string().trim().min(5).max(220),
  category: z.string().trim().min(2).max(160),
  targetMarket: z.string().trim().min(2).max(160).default("Rwanda"),
  details: z.string().trim().min(20).max(8000),
});

export async function POST(request: Request) {
  const auth = await requireUser(["buyer", "supplier"]);
  if ("response" in auth) return auth.response;

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Complete all required fields. Details must be at least 20 characters." }, { status: 400 });
  const id = randomBytes(16).toString("hex");
  const reference = `LMC-REQ-${new Date().getFullYear()}-${randomBytes(8).toString("hex").toUpperCase()}`;
  try {
    await getDb().clientRequest.create({
      data: {
        id,
        reference,
        submittedBy: auth.user.id,
        requestType: parsed.data.requestType,
        title: parsed.data.title,
        category: parsed.data.category,
        targetMarket: parsed.data.targetMarket,
        details: parsed.data.details,
      },
    });
    return NextResponse.json({ id, reference, status: "submitted" }, { status: 201 });
  } catch (error) {
    console.error("Client request create failed", error);
    return NextResponse.json({ error: "Could not submit your request." }, { status: 500 });
  }
}
