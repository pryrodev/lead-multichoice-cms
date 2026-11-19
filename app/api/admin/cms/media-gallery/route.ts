import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/api";
import { getDb } from "@/lib/db";
import { defaultMediaGallery, mergeMediaGallery } from "@/lib/cms/media-gallery";

const localizedText = z.record(z.string().min(2).max(5), z.string().max(1200));
const contentSchema = z.object({
  stories: z.array(z.object({
    id: z.string().min(1).max(80).regex(/^[a-z0-9][a-z0-9-]*$/i),
    image: z.string().min(1).max(1200).refine((value) => value.startsWith("/") || /^https:\/\//i.test(value), "Choose a media-library image or local image."),
    alt: localizedText,
    category: localizedText,
    title: localizedText,
    description: localizedText,
  })).max(100),
}).superRefine(({ stories }, ctx) => {
  const ids = stories.map((story) => story.id.toLowerCase());
  if (new Set(ids).size !== ids.length) ctx.addIssue({ code: "custom", path: ["stories"], message: "Each gallery story needs a unique ID." });
});

export async function GET() {
  const auth = await requireUser(["admin"]);
  if ("response" in auth) return auth.response;
  try {
    const page = await getDb().sitePage.findUnique({ where: { slug: "media-gallery" }, select: { draftContent: true, publishedContent: true, publishedAt: true, updatedAt: true } });
    const stored = page?.draftContent ?? page?.publishedContent;
    const parsed = typeof stored === "string" ? JSON.parse(stored) as unknown : stored;
    return NextResponse.json({ content: parsed ? mergeMediaGallery(parsed) : defaultMediaGallery, hasDraft: Boolean(page?.draftContent), publishedAt: page?.publishedAt?.toISOString() ?? null, updatedAt: page?.updatedAt.toISOString() ?? null });
  } catch (error) {
    console.error("CMS media gallery read failed", error);
    return NextResponse.json({ error: "Could not load the media gallery." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const auth = await requireUser(["admin"]);
  if ("response" in auth) return auth.response;
  const parsed = contentSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Check the media gallery entries." }, { status: 400 });
  try {
    await getDb().sitePage.upsert({
      where: { slug: "media-gallery" },
      create: { id: randomBytes(16).toString("hex"), slug: "media-gallery", draftContent: parsed.data, updatedBy: auth.user.id },
      update: { draftContent: parsed.data, updatedBy: auth.user.id },
    });
    return NextResponse.json({ content: parsed.data, hasDraft: true });
  } catch (error) {
    console.error("CMS media gallery draft save failed", error);
    return NextResponse.json({ error: "Could not save the media gallery." }, { status: 500 });
  }
}
