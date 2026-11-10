import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/api";
import { getDb } from "@/lib/db";
import { defaultProcurementResources, mergeProcurementResources } from "@/lib/cms/procurement-resources";

const resourceSchema = z.object({
  id: z.string().min(1).max(80).regex(/^[a-z0-9][a-z0-9-]*$/i),
  name: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(500),
  cta: z.string().trim().min(1).max(100),
  url: z.string().url().max(1200).refine((value) => new URL(value).protocol === "https:", "Use a secure HTTPS link."),
});
const contentSchema = z.object({ resources: z.array(resourceSchema).max(50) }).superRefine(({ resources }, ctx) => {
  const ids = resources.map((item) => item.id.toLowerCase());
  if (new Set(ids).size !== ids.length) ctx.addIssue({ code: "custom", path: ["resources"], message: "Each resource needs a unique ID." });
});

export async function GET() {
  const auth = await requireUser(["admin"]);
  if ("response" in auth) return auth.response;
  try {
    const page = await getDb().sitePage.findUnique({
      where: { slug: "procurement-resources" },
      select: { draftContent: true, publishedContent: true, publishedAt: true, updatedAt: true },
    });
    const stored = page?.draftContent ?? page?.publishedContent;
    const parsed = typeof stored === "string" ? JSON.parse(stored) as unknown : stored;
    return NextResponse.json({
      content: parsed ? mergeProcurementResources(parsed) : defaultProcurementResources,
      hasDraft: Boolean(page?.draftContent),
      publishedAt: page?.publishedAt?.toISOString() ?? null,
      updatedAt: page?.updatedAt.toISOString() ?? null,
    });
  } catch (error) {
    console.error("CMS procurement resources read failed", error);
    return NextResponse.json({ error: "Could not load procurement resources." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const auth = await requireUser(["admin"]);
  if ("response" in auth) return auth.response;
  const parsed = contentSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Check each resource and use a valid HTTPS URL." }, { status: 400 });
  try {
    await getDb().sitePage.upsert({
      where: { slug: "procurement-resources" },
      create: { id: randomBytes(16).toString("hex"), slug: "procurement-resources", draftContent: parsed.data, updatedBy: auth.user.id },
      update: { draftContent: parsed.data, updatedBy: auth.user.id },
    });
    return NextResponse.json({ content: parsed.data, hasDraft: true });
  } catch (error) {
    console.error("CMS procurement resources draft save failed", error);
    return NextResponse.json({ error: "Could not save procurement resources." }, { status: 500 });
  }
}
