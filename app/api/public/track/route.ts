import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";

const lookupSchema = z.string().trim().min(8).max(32);

async function findRequest(reference: string) {
  const result = await getDb().clientRequest.findUnique({
    where: { reference: reference.toUpperCase() },
    select: {
      reference: true,
      title: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      engagement: {
        select: {
          stage: true,
          status: true,
          updatedAt: true,
          milestones: {
            orderBy: [{ sortOrder: "asc" }, { dueDate: "asc" }],
            select: { title: true, dueDate: true, isComplete: true },
          },
          updates: {
            where: { visibility: "client" },
            orderBy: { createdAt: "desc" },
            select: { title: true, message: true, createdAt: true },
          },
        },
      },
    },
  });
  if (!result) return null;
  return {
    reference: result.reference,
    title: result.title,
    status: result.status,
    createdAt: result.createdAt.toISOString(),
    updatedAt: (result.engagement?.updatedAt ?? result.updatedAt).toISOString(),
    engagement: result.engagement ? {
      stage: result.engagement.stage,
      status: result.engagement.status,
      milestones: result.engagement.milestones.map((milestone) => ({
        title: milestone.title,
        dueDate: milestone.dueDate?.toISOString().slice(0, 10) ?? null,
        isComplete: milestone.isComplete,
      })),
      updates: result.engagement.updates.map((update) => ({
        title: update.title,
        message: update.message,
        createdAt: update.createdAt.toISOString(),
      })),
    } : null,
  };
}

export async function GET(request: Request) {
  const parsed = lookupSchema.safeParse(new URL(request.url).searchParams.get("reference") ?? "");
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid Tracking ID." }, { status: 400 });

  try {
    const result = await findRequest(parsed.data.toUpperCase());
    if (!result) return NextResponse.json({ error: "We couldn't find a request with that Tracking ID." }, { status: 404, headers: { "Cache-Control": "private, no-store" } });
    return NextResponse.json(result, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Public order tracking lookup failed", error);
    return NextResponse.json({ error: "Tracking is temporarily unavailable. Please try again." }, { status: 500 });
  }
}
