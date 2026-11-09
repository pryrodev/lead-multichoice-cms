import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/api";
import { getDb } from "@/lib/db";

const updateSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  description: z.string().trim().max(500).optional(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  isTerminal: z.boolean().optional(),
}).refine((value) => Object.keys(value).length > 0);

export async function PATCH(request: Request, context: { params: Promise<{ statusId: string }> }) {
  const auth = await requireUser(["admin"]);
  if ("response" in auth) return auth.response;
  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Check the status details and try again." }, { status: 400 });
  const { statusId } = await context.params;
  const { name, description, sortOrder, isActive, isTerminal } = parsed.data;
  try {
    const status = await getDb().trackingStatus.update({
      where: { id: statusId },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(sortOrder !== undefined ? { sortOrder } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
        ...(isTerminal !== undefined ? { isTerminal } : {}),
      },
    });
    return NextResponse.json({ status });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2025") {
      return NextResponse.json({ error: "Tracking status not found." }, { status: 404 });
    }
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "That status already exists for this request type." }, { status: 409 });
    }
    console.error("Tracking status update failed", error);
    return NextResponse.json({ error: "Could not update this tracking status." }, { status: 500 });
  }
}
