import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/api";
import { getDb } from "@/lib/db";
import { defaultPartners, mergePartners } from "@/lib/cms/partners";

const partnerSchema = z.object({
  id: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9][a-z0-9-]*$/i),
  name: z.string().trim().min(1).max(160),
  href: z
    .string()
    .url()
    .max(1200)
    .refine((value) => new URL(value).protocol === "https:", "Use a secure HTTPS link."),
  logo: z
    .string()
    .max(1200)
    .refine(
      (value) => !value || value.startsWith("/") || /^https:\/\//i.test(value),
      "Choose a local or HTTPS logo image.",
    ),
});
const contentSchema = z
  .object({ partners: z.array(partnerSchema).max(100) })
  .superRefine(({ partners }, ctx) => {
    const ids = partners.map((partner) => partner.id.toLowerCase());
    if (new Set(ids).size !== ids.length)
      ctx.addIssue({
        code: "custom",
        path: ["partners"],
        message: "Each partner needs a unique ID.",
      });
  });

export async function GET() {
  const auth = await requireUser(["admin"]);
  if ("response" in auth) return auth.response;
  try {
    const page = await getDb().sitePage.findUnique({
      where: { slug: "partners" },
      select: { draftContent: true, publishedContent: true, publishedAt: true, updatedAt: true },
    });
    const stored = page?.draftContent ?? page?.publishedContent;
    const parsed = typeof stored === "string" ? (JSON.parse(stored) as unknown) : stored;
    return NextResponse.json({
      content: parsed ? mergePartners(parsed) : defaultPartners,
      hasDraft: Boolean(page?.draftContent),
      publishedAt: page?.publishedAt?.toISOString() ?? null,
      updatedAt: page?.updatedAt.toISOString() ?? null,
    });
  } catch (error) {
    console.error("CMS partners read failed", error);
    return NextResponse.json({ error: "Could not load website partners." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const auth = await requireUser(["admin"]);
  if ("response" in auth) return auth.response;
  const parsed = contentSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { error: "Check each partner name, HTTPS link, and logo." },
      { status: 400 },
    );
  try {
    await getDb().sitePage.upsert({
      where: { slug: "partners" },
      create: {
        id: randomBytes(16).toString("hex"),
        slug: "partners",
        draftContent: parsed.data,
        updatedBy: auth.user.id,
      },
      update: { draftContent: parsed.data, updatedBy: auth.user.id },
    });
    return NextResponse.json({ content: parsed.data, hasDraft: true });
  } catch (error) {
    console.error("CMS partners draft save failed", error);
    return NextResponse.json({ error: "Could not save website partners." }, { status: 500 });
  }
}
