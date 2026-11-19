import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/api";
import { getDb } from "@/lib/db";
import { defaultSiteSeoContent, mergeSiteSeo, seoPages } from "@/lib/cms/site-seo";

const pageIds = seoPages.map((page) => page.id) as [string, ...string[]];
const contentSchema = z.object({
  pages: z.array(z.object({
    pageId: z.enum(pageIds),
    slug: z.string().max(80).regex(/^(|[a-z0-9]+(?:-[a-z0-9]+)*)$/, "Use lowercase letters, numbers, and single hyphens."),
    seoTitle: z.string().trim().min(1).max(120),
    seoDescription: z.string().trim().min(1).max(320),
  })).length(seoPages.length),
}).superRefine((content, ctx) => {
  const ids = content.pages.map((page) => page.pageId);
  const slugs = content.pages.filter((page) => page.slug).map((page) => page.slug);
  if (new Set(ids).size !== seoPages.length) ctx.addIssue({ code: "custom", path: ["pages"], message: "Include each website page once." });
  if (new Set(slugs).size !== slugs.length) ctx.addIssue({ code: "custom", path: ["pages"], message: "Each page needs a unique URL slug." });
  if (content.pages.find((page) => page.pageId === "home")?.slug !== "") ctx.addIssue({ code: "custom", path: ["pages"], message: "The homepage stays at the root URL." });
  if (content.pages.some((page) => page.pageId !== "home" && !page.slug)) ctx.addIssue({ code: "custom", path: ["pages"], message: "Every public page needs a URL slug." });
  const reserved = new Set(["admin", "api", "portal", "auth", "reset-password", "preview"]);
  if (content.pages.some((page) => page.pageId !== "home" && reserved.has(page.slug))) ctx.addIssue({ code: "custom", path: ["pages"], message: "That URL is reserved for a system page." });
});

export async function GET() {
  const auth = await requireUser(["admin"]);
  if ("response" in auth) return auth.response;
  try {
    const page = await getDb().sitePage.findUnique({ where: { slug: "site-seo" }, select: { draftContent: true, publishedContent: true, publishedAt: true, updatedAt: true } });
    const stored = page?.draftContent ?? page?.publishedContent;
    const parsed = typeof stored === "string" ? JSON.parse(stored) as unknown : stored;
    return NextResponse.json({ content: parsed ? mergeSiteSeo(parsed) : defaultSiteSeoContent, hasDraft: Boolean(page?.draftContent), publishedAt: page?.publishedAt?.toISOString() ?? null, updatedAt: page?.updatedAt.toISOString() ?? null });
  } catch (error) {
    console.error("CMS page SEO read failed", error);
    return NextResponse.json({ error: "Could not load page SEO settings." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const auth = await requireUser(["admin"]);
  if ("response" in auth) return auth.response;
  const parsed = contentSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Check the page SEO values." }, { status: 400 });
  try {
    await getDb().sitePage.upsert({
      where: { slug: "site-seo" },
      create: { id: randomBytes(16).toString("hex"), slug: "site-seo", draftContent: parsed.data, updatedBy: auth.user.id },
      update: { draftContent: parsed.data, updatedBy: auth.user.id },
    });
    return NextResponse.json({ content: parsed.data, hasDraft: true });
  } catch (error) {
    console.error("CMS page SEO draft save failed", error);
    return NextResponse.json({ error: "Could not save page SEO settings." }, { status: 500 });
  }
}
