import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/api";
import { getDb } from "@/lib/db";
import { HOME_CMS_FIELDS, defaultHomePageContent, mergeHomePageContent, type HomePageContent } from "@/lib/cms/homepage";
import { cmsLanguages } from "@/i18n/messages";

const translationsSchema = z.object(Object.fromEntries(cmsLanguages.map((language) => [language, z.record(z.string(), z.string().max(5000))])) as unknown as Record<(typeof cmsLanguages)[number], z.ZodTypeAny>);
const contentSchema = z.object({ translations: translationsSchema, heroImageUrl: z.string().max(1200) }).superRefine((content, context) => {
  for (const language of cmsLanguages) {
    for (const field of HOME_CMS_FIELDS) {
      if (!(field.text in content.translations[language])) context.addIssue({ code: "custom", path: ["translations", language, field.text], message: "A homepage field is missing." });
    }
  }
});

export async function GET() {
  const auth = await requireUser(["admin"]); if ("response" in auth) return auth.response;
  try {
    const page = await getDb().sitePage.findUnique({ where: { slug: "home" }, select: { draftContent: true, publishedContent: true, publishedAt: true, updatedAt: true } });
    const stored = page?.draftContent ?? page?.publishedContent;
    const content = stored ? mergeHomePageContent(typeof stored === "string" ? JSON.parse(stored) : stored) : defaultHomePageContent;
    return NextResponse.json({ content, hasDraft: Boolean(page?.draftContent), publishedAt: page?.publishedAt?.toISOString() ?? null, updatedAt: page?.updatedAt.toISOString() ?? null });
  } catch (error) { console.error("CMS homepage read failed", error); return NextResponse.json({ error: "Could not load homepage content." }, { status: 500 }); }
}

export async function PUT(request: Request) {
  const auth = await requireUser(["admin"]); if ("response" in auth) return auth.response;
  const parsed = contentSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Some homepage fields are missing or too long." }, { status: 400 });
  try {
    await getDb().sitePage.upsert({
      where: { slug: "home" },
      create: { id: randomBytes(16).toString("hex"), slug: "home", draftContent: parsed.data, updatedBy: auth.user.id },
      update: { draftContent: parsed.data, updatedBy: auth.user.id },
    });
    return NextResponse.json({ content: parsed.data, hasDraft: true });
  } catch (error) { console.error("CMS homepage draft save failed", error); return NextResponse.json({ error: "Could not save the homepage draft." }, { status: 500 }); }
}
