import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/api";
import { getDb } from "@/lib/db";
import { SITE_VISUAL_FIELDS, defaultSiteVisuals, mergeSiteVisuals } from "@/lib/cms/site-visuals";

const imageSchema = z.string().min(1).max(1200).refine(
  (value) => value.startsWith("/") || /^https:\/\//i.test(value),
  "Choose a local image or HTTPS media URL.",
);
const contentSchema = z.object(Object.fromEntries(
  SITE_VISUAL_FIELDS.map(({ key }) => [key, imageSchema]),
) as z.ZodRawShape);

export async function GET() {
  const auth = await requireUser(["admin"]);
  if ("response" in auth) return auth.response;
  try {
    const page = await getDb().sitePage.findUnique({
      where: { slug: "site-visuals" },
      select: { draftContent: true, publishedContent: true, publishedAt: true, updatedAt: true },
    });
    const stored = page?.draftContent ?? page?.publishedContent;
    const parsed = typeof stored === "string" ? JSON.parse(stored) as unknown : stored;
    return NextResponse.json({
      content: parsed ? mergeSiteVisuals(parsed) : defaultSiteVisuals,
      hasDraft: Boolean(page?.draftContent),
      publishedAt: page?.publishedAt?.toISOString() ?? null,
      updatedAt: page?.updatedAt.toISOString() ?? null,
    });
  } catch (error) {
    console.error("CMS site visuals read failed", error);
    return NextResponse.json({ error: "Could not load website backgrounds." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const auth = await requireUser(["admin"]);
  if ("response" in auth) return auth.response;
  const parsed = contentSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Choose a valid image for each website background." }, { status: 400 });
  }
  try {
    await getDb().sitePage.upsert({
      where: { slug: "site-visuals" },
      create: { id: randomBytes(16).toString("hex"), slug: "site-visuals", draftContent: parsed.data, updatedBy: auth.user.id },
      update: { draftContent: parsed.data, updatedBy: auth.user.id },
    });
    return NextResponse.json({ content: parsed.data, hasDraft: true });
  } catch (error) {
    console.error("CMS site visuals draft save failed", error);
    return NextResponse.json({ error: "Could not save website backgrounds." }, { status: 500 });
  }
}
