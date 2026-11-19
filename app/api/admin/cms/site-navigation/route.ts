import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/api";
import { getDb } from "@/lib/db";
import { defaultSiteNavigation, mergeSiteNavigation } from "@/lib/cms/site-navigation";
import { seoPages } from "@/lib/cms/site-seo";

const pageIds = seoPages.filter((page) => page.id !== "home").map((page) => page.id) as [string, ...string[]];
const contentSchema = z.object({
  groups: z.array(z.object({
    id: z.string().min(1).max(80).regex(/^[a-z0-9][a-z0-9-]*$/i),
    label: z.string().trim().min(1).max(60),
    links: z.array(z.object({
      id: z.string().min(1).max(80).regex(/^[a-z0-9][a-z0-9-]*$/i),
      pageId: z.enum(pageIds),
      label: z.string().trim().min(1).max(80),
    })).max(12),
  })).min(1).max(8),
}).superRefine(({ groups }, ctx) => {
  const groupIds = groups.map((group) => group.id.toLowerCase());
  const linkIds = groups.flatMap((group) => group.links.map((link) => link.id.toLowerCase()));
  const pageTargets = groups.flatMap((group) => group.links.map((link) => link.pageId));
  if (new Set(groupIds).size !== groupIds.length) ctx.addIssue({ code: "custom", path: ["groups"], message: "Navigation group IDs must be unique." });
  if (new Set(linkIds).size !== linkIds.length) ctx.addIssue({ code: "custom", path: ["groups"], message: "Navigation link IDs must be unique." });
  if (new Set(pageTargets).size !== pageTargets.length) ctx.addIssue({ code: "custom", path: ["groups"], message: "Each page can appear once in the header navigation." });
});

export async function GET() {
  const auth = await requireUser(["admin"]);
  if ("response" in auth) return auth.response;
  try {
    const page = await getDb().sitePage.findUnique({ where: { slug: "site-navigation" }, select: { draftContent: true, publishedContent: true, publishedAt: true, updatedAt: true } });
    const stored = page?.draftContent ?? page?.publishedContent;
    const parsed = typeof stored === "string" ? JSON.parse(stored) as unknown : stored;
    return NextResponse.json({ content: parsed ? mergeSiteNavigation(parsed) : defaultSiteNavigation, hasDraft: Boolean(page?.draftContent), publishedAt: page?.publishedAt?.toISOString() ?? null, updatedAt: page?.updatedAt.toISOString() ?? null });
  } catch (error) {
    console.error("CMS site navigation read failed", error);
    return NextResponse.json({ error: "Could not load website navigation." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const auth = await requireUser(["admin"]);
  if ("response" in auth) return auth.response;
  const parsed = contentSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Check the navigation values." }, { status: 400 });
  try {
    await getDb().sitePage.upsert({
      where: { slug: "site-navigation" },
      create: { id: randomBytes(16).toString("hex"), slug: "site-navigation", draftContent: parsed.data, updatedBy: auth.user.id },
      update: { draftContent: parsed.data, updatedBy: auth.user.id },
    });
    return NextResponse.json({ content: parsed.data, hasDraft: true });
  } catch (error) {
    console.error("CMS site navigation draft save failed", error);
    return NextResponse.json({ error: "Could not save website navigation." }, { status: 500 });
  }
}
