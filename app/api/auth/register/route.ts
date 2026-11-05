import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { apiError } from "@/lib/auth/api";
import { isClientPortalEnabled } from "@/lib/auth/portal-access";

const registerSchema = z.object({
  name: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(254),
  organization: z.string().trim().min(2).max(200),
  phone: z.string().trim().max(40).optional().default(""),
  role: z.enum(["buyer", "supplier"]),
  password: z.string().min(10).max(128),
});

export async function POST(request: Request) {
  if (!isClientPortalEnabled()) return NextResponse.json({ error: "Client portal access is currently unavailable." }, { status: 503 });
  try {
    const parsed = registerSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Check the account details and use a password of at least 10 characters." }, { status: 400 });
    const input = parsed.data;
    const id = randomBytes(16).toString("hex");
    const passwordHash = await hashPassword(input.password);
    await getDb().user.create({
      data: {
        id,
        name: input.name,
        email: input.email.toLowerCase(),
        organization: input.organization,
        phone: input.phone || null,
        role: input.role,
        passwordHash,
      },
    });
    await createSession(id);
    return NextResponse.json({ user: { id, name: input.name, email: input.email.toLowerCase(), organization: input.organization, role: input.role } }, { status: 201 });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }
    return apiError(error);
  }
}
