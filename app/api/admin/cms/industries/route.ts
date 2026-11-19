import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/api";
import { getDb } from "@/lib/db";
import { defaultIndustriesContent, mergeIndustriesContent } from "@/lib/cms/industries";

const sectorSchema = z.object({
  id: z.string().trim().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(1).max(180),
  text: z.string().trim().max(600),
  image: z.string().trim().min(1).max(1200),
  alt: z.string().trim().min(1).max(300),
  points: z.array(z.string().trim().min(1).max(200)).max(12),
}).superRefine((sector, context) => {
  if (sector.image.startsWith("/")) return;
  try { if (new URL(sector.image).protocol !== "https:") throw new Error(); }
  catch { context.addIssue({ code: "custom", path: ["image"], message: "Select an image from the media library." }); }
});

const contentSchema = z.object({
  heroTitle: z.string().trim().min(1).max(200),
  heroIntro: z.string().trim().min(1).max(500),
  sectors: z.array(sectorSchema).max(30),
}).superRefine(({ sectors }, context) => {
  const ids = sectors.map((sector) => sector.id);
  if (new Set(ids).size !== ids.length) context.addIssue({ code: "custom", path: ["sectors"], message: "Each industry needs a unique URL id." });
});

export async function GET() {
  const auth = await requireUser(["admin"]);
  if ("response" in auth) return auth.response;
  try {
    const page = await getDb().sitePage.findUnique({
      where: { slug: "industries" },
      select: { draftContent: true, publishedContent: true, publishedAt: true, updatedAt: true },
    });
    const stored = page?.draftContent ?? page?.publishedContent;
    const content = typeof stored === "string" ? JSON.parse(stored) as unknown : stored;
    return NextResponse.json({
      content: content ? mergeIndustriesContent(content) : defaultIndustriesContent,
      hasDraft: Boolean(page?.draftContent),
      publishedAt: page?.publishedAt?.toISOString() ?? null,
      updatedAt: page?.updatedAt.toISOString() ?? null,
    });
  } catch (error) {
    console.error("CMS industries read failed", error);
    return NextResponse.json({ error: "Could not load industries content." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const auth = await requireUser(["admin"]);
  if ("response" in auth) return auth.response;
  const parsed = contentSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Check the industry names, descriptions, images, and unique ids." }, { status: 400 });
  try {
    await getDb().sitePage.upsert({
      where: { slug: "industries" },
      create: { id: randomBytes(16).toString("hex"), slug: "industries", draftContent: parsed.data, updatedBy: auth.user.id },
      update: { draftContent: parsed.data, updatedBy: auth.user.id },
    });
    return NextResponse.json({ content: parsed.data, hasDraft: true });
  } catch (error) {
    console.error("CMS industries draft save failed", error);
    return NextResponse.json({ error: "Could not save industries content." }, { status: 500 });
  }
}
