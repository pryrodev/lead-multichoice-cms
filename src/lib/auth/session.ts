import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { getDb } from "@/lib/db";
import { isClientPortalEnabled } from "./portal-access";

export const sessionCookieName = "lmc_session";
const sessionLifetimeSeconds = 60 * 60 * 24 * 30;
const sessionLifetimeMs = sessionLifetimeSeconds * 1000;
const sessionRenewalWindowMs = sessionLifetimeMs / 2;

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
  // Remove expired rows opportunistically so abandoned sessions do not accumulate indefinitely.
  await getDb().authSession.deleteMany({ where: { expiresAt: { lte: new Date() } } });
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

/**
 * Read the current database session. Route handlers may opt into rolling renewal;
 * Server Components must use the read-only default because they cannot write cookies.
 */
export async function getSessionUser(options: { renew?: boolean } = {}): Promise<SessionUser | null> {
  if (!isClientPortalEnabled()) return null;
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;
  if (!token) return null;

  const now = new Date();
  const tokenHash = digest(token);
  const session = await getDb().authSession.findFirst({
    where: { tokenHash, expiresAt: { gt: now }, user: { isActive: true } },
    select: {
      id: true,
      expiresAt: true,
      user: { select: { id: true, name: true, email: true, organization: true, role: true, canManageEngagements: true } },
    },
  });

  if (!session) return null;

  // Extend active sessions halfway through their lifetime, avoiding a database write
  // on every API request while preventing active users from hitting a hard 30-day cutoff.
  if (options.renew && session.expiresAt.getTime() - now.getTime() <= sessionRenewalWindowMs) {
    const expiresAt = new Date(now.getTime() + sessionLifetimeMs);
    const updated = await getDb().authSession.updateMany({
      where: { id: session.id, tokenHash, expiresAt: { gt: now } },
      data: { expiresAt },
    });

    if (updated.count === 1) {
      cookieStore.set(sessionCookieName, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: sessionLifetimeSeconds,
      });
    }
  }

  return session.user;
}
