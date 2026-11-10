import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/api";
import { getDb } from "@/lib/db";

const defaults = {
  legalName: "LEAD MULTI-CHOICE ® Ltd",
  taxId: "",
  email: "",
  phone: "+250 788 312 338",
  legalAddress: "Remera, Kigali, Rwanda",
  websiteUrl: "",
};

const companySchema = z.object({
  legalName: z.string().trim().min(2).max(200),
  taxId: z.string().trim().max(80),
  email: z.union([z.literal(""), z.string().trim().email().max(254)]),
  phone: z.string().trim().max(40),
  legalAddress: z.string().trim().max(500),
  websiteUrl: z.union([z.literal(""), z.string().trim().url().max(500)]),
});

export async function GET() {
  const auth = await requireUser(["admin"]);
  if ("response" in auth) return auth.response;

  try {
    const row = await getDb().companySettings.findUnique({ where: { id: 1 } });
    if (!row) return NextResponse.json(defaults);
    return NextResponse.json({
      legalName: row.legalName,
      taxId: row.taxId,
      email: row.email ?? "",
      phone: row.phone,
      legalAddress: row.legalAddress,
      websiteUrl: row.websiteUrl ?? "",
    });
  } catch (error) {
    console.error("Company settings read failed", error);
    return NextResponse.json({ error: "Could not load company settings." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const auth = await requireUser(["admin"]);
  if ("response" in auth) return auth.response;
  const parsed = companySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Review the company details and try again." }, { status: 400 });

  const value = parsed.data;
  try {
    await getDb().companySettings.upsert({
      where: { id: 1 },
      create: { id: 1, ...value, email: value.email || null, websiteUrl: value.websiteUrl || null, updatedBy: auth.user.id },
      update: { ...value, email: value.email || null, websiteUrl: value.websiteUrl || null, updatedBy: auth.user.id },
    });
    return NextResponse.json(value);
  } catch (error) {
    console.error("Company settings update failed", error);
    return NextResponse.json({ error: "Could not save company settings." }, { status: 500 });
  }
}
