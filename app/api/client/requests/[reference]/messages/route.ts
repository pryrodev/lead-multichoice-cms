import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/api";
import { getDb } from "@/lib/db";

const messageSchema = z.object({ message: z.string().trim().min(2).max(3000) });
const noStore = { "Cache-Control": "private, no-store" };

export async function GET(_request: Request, context: { params: Promise<{ reference: string }> }) {
  const auth = await requireUser(["buyer", "supplier"]);
  if ("response" in auth) return auth.response;
  const { reference } = await context.params;
  try {
    const ownedRequest = await getDb().clientRequest.findFirst({
      where: { reference: reference.toUpperCase(), submittedBy: auth.user.id },
      select: { id: true },
    });
    if (!ownedRequest) return NextResponse.json({ error: "Request not found in your account." }, { status: 404, headers: noStore });
    const messages = await getDb().requestMessage.findMany({
      where: { requestId: ownedRequest.id },
      orderBy: { createdAt: "asc" },
      select: { id: true, senderType: true, senderName: true, message: true, createdAt: true },
    });
    return NextResponse.json({ messages: messages.map((item) => ({ ...item, createdAt: item.createdAt.toISOString() })) }, { headers: noStore });
  } catch (error) {
    console.error("Client conversation lookup failed", error);
    return NextResponse.json({ error: "Messages are temporarily unavailable." }, { status: 500, headers: noStore });
  }
}

export async function POST(request: Request, context: { params: Promise<{ reference: string }> }) {
  const auth = await requireUser(["buyer", "supplier"]);
  if ("response" in auth) return auth.response;
  const parsed = messageSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Write a message with at least 2 characters." }, { status: 400, headers: noStore });
  const { reference } = await context.params;
  try {
    const ownedRequest = await getDb().clientRequest.findFirst({
      where: { reference: reference.toUpperCase(), submittedBy: auth.user.id },
      select: { id: true },
    });
    if (!ownedRequest) return NextResponse.json({ error: "Request not found in your account." }, { status: 404, headers: noStore });
    const created = await getDb().requestMessage.create({
      data: {
        id: randomBytes(16).toString("hex"),
        requestId: ownedRequest.id,
        senderUserId: auth.user.id,
        senderType: "client",
        senderName: auth.user.name,
        message: parsed.data.message,
      },
      select: { id: true, senderType: true, senderName: true, message: true, createdAt: true },
    });
    return NextResponse.json({ message: { ...created, createdAt: created.createdAt.toISOString() } }, { status: 201, headers: noStore });
  } catch (error) {
    console.error("Client message create failed", error);
    return NextResponse.json({ error: "Could not send your message." }, { status: 500, headers: noStore });
  }
}
