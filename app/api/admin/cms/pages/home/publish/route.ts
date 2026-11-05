import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/api";
import { getDb } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";

export async function POST() {
  const auth = await requireUser(["admin"]); if ("response" in auth) return auth.response;
  try {
    const db = getDb();
    const page = await db.sitePage.findUnique({ where: { slug: "home" }, select: { draftContent: true } });
    if (!page?.draftContent) return NextResponse.json({ error: "Save a homepage draft before publishing." }, { status: 409 });
    const publishedAt = new Date();
    await db.sitePage.update({ where: { slug: "home" }, data: { publishedContent: page.draftContent, draftContent: Prisma.DbNull, publishedBy: auth.user.id, publishedAt } });
    return NextResponse.json({ published: true, publishedAt: publishedAt.toISOString() });
  } catch (error) { console.error("CMS homepage publish failed", error); return NextResponse.json({ error: "Could not publish the homepage." }, { status: 500 }); }
}
