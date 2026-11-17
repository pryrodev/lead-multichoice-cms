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
      requestType: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      shipments: {
        orderBy: { createdAt: "desc" },
        select: {
          reference: true,
          cargo: true,
          corridor: true,
          origin: true,
          destination: true,
          progress: true,
          eta: true,
          clearance: true,
          milestones: {
            orderBy: { sortOrder: "asc" },
            select: { label: true, eventDate: true, isComplete: true },
          },
        },
      },
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
            select: {
              title: true,
              message: true,
              createdAt: true,
              trackingStatus: { select: { id: true, name: true, description: true, sortOrder: true, isTerminal: true } },
            },
          },
        },
      },
    },
  });
  if (!result) return null;
  const historicallyUsedStatusIds = result.engagement?.updates
    .map((update) => update.trackingStatus?.id)
    .filter((id): id is string => Boolean(id)) ?? [];
  const trackingStatuses = await getDb().trackingStatus.findMany({
    where: {
      requestType: result.requestType,
      OR: [{ isActive: true }, { id: { in: historicallyUsedStatusIds } }],
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: { id: true, requestType: true, name: true, description: true, sortOrder: true, isActive: true, isTerminal: true },
  });
  const currentTrackingStatusId = result.engagement?.updates.find((update) => update.trackingStatus)?.trackingStatus?.id ?? null;
  return {
    reference: result.reference,
    title: result.title,
    requestType: result.requestType,
    status: result.status,
    createdAt: result.createdAt.toISOString(),
    updatedAt: (result.engagement?.updatedAt ?? result.updatedAt).toISOString(),
    shipments: result.shipments.map((shipment) => ({
      reference: shipment.reference,
      cargo: shipment.cargo,
      corridor: shipment.corridor,
      origin: shipment.origin,
      destination: shipment.destination,
      progress: shipment.progress,
      eta: shipment.eta?.toISOString().slice(0, 10) ?? null,
      clearance: shipment.clearance,
      milestones: shipment.milestones.map((milestone) => ({
        label: milestone.label,
        date: milestone.eventDate?.toISOString().slice(0, 10) ?? null,
        done: milestone.isComplete,
      })),
    })),
    engagement: result.engagement ? {
      stage: result.engagement.stage,
      status: result.engagement.status,
      currentTrackingStatusId,
      trackingStatuses,
      milestones: result.engagement.milestones.map((milestone) => ({
        title: milestone.title,
        dueDate: milestone.dueDate?.toISOString().slice(0, 10) ?? null,
        isComplete: milestone.isComplete,
      })),
      updates: result.engagement.updates.map((update) => ({
        title: update.title,
        message: update.message,
        createdAt: update.createdAt.toISOString(),
        trackingStatus: update.trackingStatus,
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
