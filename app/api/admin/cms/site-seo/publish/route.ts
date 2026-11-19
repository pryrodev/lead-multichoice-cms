import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { requireUser } from "@/lib/auth/api";
import { getDb } from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST() {
  const auth = await requireUser(["admin"]);
  if ("response" in auth) return auth.response;
  try {
    const db = getDb();
    const page = await db.sitePage.findUnique({ where: { slug: "site-seo" }, select: { draftContent: true } });
    if (!page?.draftContent) return NextResponse.json({ error: "Save page SEO settings before publishing." }, { status: 409 });
    const publishedAt = new Date();
    await db.sitePage.update({ where: { slug: "site-seo" }, data: { publishedContent: page.draftContent, draftContent: Prisma.DbNull, publishedBy: auth.user.id, publishedAt } });
    revalidateTag("cms-site-seo", "max");
    revalidatePath("/", "layout");
    return NextResponse.json({ published: true, publishedAt: publishedAt.toISOString() });
  } catch (error) {
    console.error("CMS page SEO publish failed", error);
    return NextResponse.json({ error: "Could not publish page SEO settings." }, { status: 500 });
  }
}
