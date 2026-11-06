import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession } from "@/lib/auth/session";
import { verifyPassword } from "@/lib/auth/password";
import { getDb } from "@/lib/db";
import { apiError } from "@/lib/auth/api";
import { isClientPortalEnabled } from "@/lib/auth/portal-access";

const loginSchema = z.object({ email: z.string().trim().email().max(254), password: z.string().min(1).max(128) });

export async function POST(request: Request) {
  if (!isClientPortalEnabled()) return NextResponse.json({ error: "Client portal access is currently unavailable." }, { status: 503 });
  try {
    const parsed = loginSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
    const record = await getDb().user.findFirst({
      where: { email: parsed.data.email.toLowerCase(), isActive: true },
    });
    if (!record || !(await verifyPassword(parsed.data.password, record.passwordHash))) {
      return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
    }
    if (record.role === "staff" && !record.canManageEngagements) {
      return NextResponse.json({ error: "Your staff account is waiting for an administrator to enable engagement access." }, { status: 403 });
    }
    await createSession(record.id);
    return NextResponse.json({ user: { id: record.id, name: record.name, email: record.email, organization: record.organization, role: record.role, canManageEngagements: record.canManageEngagements } });
  } catch (error) {
    return apiError(error);
  }
}
