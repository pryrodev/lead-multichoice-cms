import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/api";
import { getDb } from "@/lib/db";
import { defaultBlogContent, mergeBlogContent } from "@/lib/cms/blog";

const articleSchema = z.object({
  slug: z.string().trim().min(1).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.string().trim().min(1).max(100),
  title: z.string().trim().min(1).max(200),
  summary: z.string().trim().min(1).max(500),
  body: z.string().trim().min(1).max(20000),
  image: z.string().trim().min(1).max(1200),
  imageAlt: z.string().trim().min(1).max(300),
}).superRefine((article, context) => {
  if (article.image.startsWith("/")) return;
  try {
    if (new URL(article.image).protocol !== "https:") throw new Error();
  } catch {
    context.addIssue({ code: "custom", path: ["image"], message: "Choose an image from the media library." });
  }
});

const contentSchema = z.object({ articles: z.array(articleSchema).max(200) }).superRefine(({ articles }, context) => {
  const slugs = articles.map((article) => article.slug.toLowerCase());
  if (new Set(slugs).size !== slugs.length) {
    context.addIssue({ code: "custom", path: ["articles"], message: "Each article needs a unique URL slug." });
  }
});

export async function GET() {
  const auth = await requireUser(["admin"]);
  if ("response" in auth) return auth.response;
  try {
    const page = await getDb().sitePage.findUnique({
      where: { slug: "blog" },
      select: { draftContent: true, publishedContent: true, publishedAt: true, updatedAt: true },
    });
    const stored = page?.draftContent ?? page?.publishedContent;
    const parsed = typeof stored === "string" ? JSON.parse(stored) as unknown : stored;
    return NextResponse.json({
      content: parsed ? mergeBlogContent(parsed) : defaultBlogContent,
      hasDraft: Boolean(page?.draftContent),
      publishedAt: page?.publishedAt?.toISOString() ?? null,
      updatedAt: page?.updatedAt.toISOString() ?? null,
    });
  } catch (error) {
    console.error("CMS blog read failed", error);
    return NextResponse.json({ error: "Could not load blog articles." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const auth = await requireUser(["admin"]);
  if ("response" in auth) return auth.response;
  const parsed = contentSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Check article details, image links, and unique slugs." }, { status: 400 });
  try {
    await getDb().sitePage.upsert({
      where: { slug: "blog" },
      create: { id: randomBytes(16).toString("hex"), slug: "blog", draftContent: parsed.data, updatedBy: auth.user.id },
      update: { draftContent: parsed.data, updatedBy: auth.user.id },
    });
    return NextResponse.json({ content: parsed.data, hasDraft: true });
  } catch (error) {
    console.error("CMS blog draft save failed", error);
    return NextResponse.json({ error: "Could not save blog articles." }, { status: 500 });
  }
}
