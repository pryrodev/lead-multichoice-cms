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
    const page = await db.sitePage.findUnique({ where: { slug: "media-gallery" }, select: { draftContent: true } });
    if (!page?.draftContent) return NextResponse.json({ error: "Save a gallery draft before publishing." }, { status: 409 });
    const publishedAt = new Date();
    await db.sitePage.update({ where: { slug: "media-gallery" }, data: { publishedContent: page.draftContent, draftContent: Prisma.DbNull, publishedBy: auth.user.id, publishedAt } });
    revalidateTag("cms-media-gallery", "max");
    revalidatePath("/media", "page");
    return NextResponse.json({ published: true, publishedAt: publishedAt.toISOString() });
  } catch (error) {
    console.error("CMS media gallery publish failed", error);
    return NextResponse.json({ error: "Could not publish the media gallery." }, { status: 500 });
  }
}
