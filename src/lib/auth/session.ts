import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { getDb } from "@/lib/db";
import { isClientPortalEnabled } from "./portal-access";

export const sessionCookieName = "lmc_session";
const sessionLifetimeSeconds = 60 * 60 * 24 * 30;

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: "buyer" | "supplier" | "admin" | "staff";
  canManageEngagements: boolean;
}

const digest = (token: string) => createHash("sha256").update(token).digest("hex");

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = digest(token);
  const expiresAt = new Date(Date.now() + sessionLifetimeSeconds * 1000);
  await getDb().authSession.create({
    data: { id: randomBytes(16).toString("hex"), userId, tokenHash, expiresAt },
  });
  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionLifetimeSeconds,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;
  cookieStore.delete(sessionCookieName);
  if (token) await getDb().authSession.deleteMany({ where: { tokenHash: digest(token) } });
}

export async function getSessionUser(): Promise<SessionUser | null> {
  if (!isClientPortalEnabled()) return null;
  const token = (await cookies()).get(sessionCookieName)?.value;
  if (!token) return null;

  const session = await getDb().authSession.findFirst({
    where: { tokenHash: digest(token), expiresAt: { gt: new Date() }, user: { isActive: true } },
    select: { user: { select: { id: true, name: true, email: true, organization: true, role: true, canManageEngagements: true } } },
  });
  return session?.user ?? null;
}
