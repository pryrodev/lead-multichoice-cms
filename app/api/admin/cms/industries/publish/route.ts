import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { Prisma } from "@/generated/prisma/client";
import { requireUser } from "@/lib/auth/api";
import { getDb } from "@/lib/db";

export async function POST() {
  const auth = await requireUser(["admin"]);
  if ("response" in auth) return auth.response;
  try {
    const db = getDb();
    const page = await db.sitePage.findUnique({ where: { slug: "industries" }, select: { draftContent: true } });
    if (!page?.draftContent) return NextResponse.json({ error: "Save industries changes before publishing." }, { status: 409 });
    const publishedAt = new Date();
    await db.sitePage.update({
      where: { slug: "industries" },
      data: { publishedContent: page.draftContent, draftContent: Prisma.DbNull, publishedBy: auth.user.id, publishedAt },
    });
    revalidateTag("cms-industries", "max");
    revalidatePath("/industries", "page");
    return NextResponse.json({ published: true, publishedAt: publishedAt.toISOString() });
  } catch (error) {
    console.error("CMS industries publish failed", error);
    return NextResponse.json({ error: "Could not publish industries content." }, { status: 500 });
  }
}
