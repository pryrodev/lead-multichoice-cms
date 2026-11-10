import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/api";
import { hashPassword } from "@/lib/auth/password";
import { getDb } from "@/lib/db";

const staffSchema = z.object({
  name: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(254),
  organization: z.string().trim().max(200).default("Lead Multi-Choice ® "),
  password: z.string().min(14).max(128),
});

export async function GET() {
  const auth = await requireUser(["admin"]);
  if ("response" in auth) return auth.response;
  const members = await getDb().user.findMany({
    where: { role: "staff" },
    select: { id: true, name: true, email: true, organization: true, canManageEngagements: true, isActive: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ members: members.map((member) => ({ ...member, createdAt: member.createdAt.toISOString() })) });
}

export async function POST(request: Request) {
  const auth = await requireUser(["admin"]);
  if ("response" in auth) return auth.response;
  const parsed = staffSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter staff details and a password of at least 14 characters." }, { status: 400 });
  const input = parsed.data;
  try {
    const member = await getDb().user.create({
      data: {
        id: randomBytes(16).toString("hex"),
        name: input.name,
        email: input.email.toLowerCase(),
        organization: input.organization || "Lead Multi-Choice ® ",
        role: "staff",
        canManageEngagements: false,
        passwordHash: await hashPassword(input.password),
      },
      select: { id: true, name: true, email: true, organization: true, canManageEngagements: true, isActive: true, createdAt: true },
    });
    return NextResponse.json({ member: { ...member, createdAt: member.createdAt.toISOString() } }, { status: 201 });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    console.error("Staff account creation failed", error);
    return NextResponse.json({ error: "Could not create the staff account." }, { status: 500 });
  }
}
