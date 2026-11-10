import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/api";
import { getDb } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST() {
  const auth = await requireUser(["admin"]);
  if ("response" in auth) return auth.response;
  try {
    const db = getDb();
    const page = await db.sitePage.findUnique({ where: { slug: "procurement-resources" }, select: { draftContent: true } });
    if (!page?.draftContent) return NextResponse.json({ error: "Save a resource draft before publishing." }, { status: 409 });
    const publishedAt = new Date();
    await db.sitePage.update({
      where: { slug: "procurement-resources" },
      data: { publishedContent: page.draftContent, draftContent: Prisma.DbNull, publishedBy: auth.user.id, publishedAt },
    });
    revalidateTag("cms-procurement-resources", "max");
    revalidatePath("/", "page");
    revalidatePath("/procurement-opportunities", "page");
    revalidatePath("/", "layout");
    return NextResponse.json({ published: true, publishedAt: publishedAt.toISOString() });
  } catch (error) {
    console.error("CMS procurement resources publish failed", error);
    return NextResponse.json({ error: "Could not publish procurement resources." }, { status: 500 });
  }
}
