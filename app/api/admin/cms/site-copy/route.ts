import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/api";
import { getDb } from "@/lib/db";
import { defaultSiteCopyContent, SITE_COPY_FIELDS, mergeSiteCopy } from "@/lib/cms/site-copy";
import { cmsLanguages } from "@/i18n/messages";

const translationsSchema = z.object(Object.fromEntries(cmsLanguages.map((language) => [language, z.record(z.string(), z.string().max(5000))])) as unknown as Record<(typeof cmsLanguages)[number], z.ZodTypeAny>);
const contentSchema = z.object({ translations: translationsSchema }).superRefine((content, context) => {
  for (const language of cmsLanguages) {
    for (const field of SITE_COPY_FIELDS) {
      if (!(field.id in content.translations[language])) {
        context.addIssue({ code: "custom", path: ["translations", language, field.id], message: "A website text is missing." });
      }
    }
  }
});

export async function GET() {
  const auth = await requireUser(["admin"]);
  if ("response" in auth) return auth.response;
  try {
    const page = await getDb().sitePage.findUnique({
      where: { slug: "site-copy" },
      select: { draftContent: true, publishedContent: true, publishedAt: true, updatedAt: true },
    });
    const stored = page?.draftContent ?? page?.publishedContent;
    const parsed = typeof stored === "string" ? JSON.parse(stored) as unknown : stored;
    return NextResponse.json({
      content: parsed ? mergeSiteCopy(parsed) : defaultSiteCopyContent,
      hasDraft: Boolean(page?.draftContent),
      publishedAt: page?.publishedAt?.toISOString() ?? null,
      updatedAt: page?.updatedAt.toISOString() ?? null,
    });
  } catch (error) {
    console.error("CMS site copy read failed", error);
    return NextResponse.json({ error: "Could not load website copy." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const auth = await requireUser(["admin"]);
  if ("response" in auth) return auth.response;
  const parsed = contentSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Some website translations are missing or too long." }, { status: 400 });
  try {
    await getDb().sitePage.upsert({
      where: { slug: "site-copy" },
      create: { id: randomBytes(16).toString("hex"), slug: "site-copy", draftContent: parsed.data, updatedBy: auth.user.id },
      update: { draftContent: parsed.data, updatedBy: auth.user.id },
    });
    return NextResponse.json({ content: parsed.data, hasDraft: true });
  } catch (error) {
    console.error("CMS site copy draft save failed", error);
    return NextResponse.json({ error: "Could not save website copy." }, { status: 500 });
  }
}
