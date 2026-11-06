import "server-only";
import { NextResponse } from "next/server";
import { getSessionUser, type SessionUser } from "./session";
import { isClientPortalEnabled } from "./portal-access";

export async function requireUser(roles?: SessionUser["role"][]) {
  if (!isClientPortalEnabled()) {
    return { response: NextResponse.json({ error: "Client portal access is currently unavailable." }, { status: 503 }) } as const;
  }
  let user: SessionUser | null;
  try {
    user = await getSessionUser();
  } catch (error) {
    console.error("Session lookup failed", error);
    return { response: NextResponse.json({ error: "Authentication service unavailable." }, { status: 503 }) } as const;
  }

  if (!user) return { response: NextResponse.json({ error: "Sign in to continue." }, { status: 401 }) } as const;
  if (roles && !roles.includes(user.role)) {
    return { response: NextResponse.json({ error: "You do not have permission to do that." }, { status: 403 }) } as const;
  }
  return { user } as const;
}

export async function requireEngagementPermission() {
  const auth = await requireUser();
  if ("response" in auth) return auth;
  if (auth.user.role !== "admin" && !(auth.user.role === "staff" && auth.user.canManageEngagements)) {
    return { response: NextResponse.json({ error: "You do not have permission to manage client engagements." }, { status: 403 }) } as const;
  }
  return auth;
}

export function apiError(error: unknown) {
  console.error("API request failed", error);
  return NextResponse.json({ error: "The request could not be completed." }, { status: 500 });
}
