import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { isClientPortalEnabled } from "@/lib/auth/portal-access";

const cookieName = "lmc_track_access";
const cookieLifetime = 30 * 60;
const lookupSchema = z.object({ reference: z.string().trim().min(8).max(32), email: z.string().trim().email().max(254) });

function signingSecret() {
  return process.env["TRACKING_COOKIE_SECRET"] || process.env["MYSQL_PASSWORD"];
}

function sign(payload: string) {
  const secret = signingSecret();
  if (!secret) throw new Error("Request tracking signing secret is not configured.");
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

async function findRequest(reference: string, email: string) {
  const result = await getDb().clientRequest.findUnique({
    where: { reference: reference.toUpperCase() },
    select: {
      reference: true,
      title: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      submitter: { select: { email: true } },
      engagement: {
        select: {
          reference: true,
          stage: true,
          status: true,
          updatedAt: true,
          milestones: {
            orderBy: [{ sortOrder: "asc" }, { dueDate: "asc" }],
            select: { title: true, dueDate: true, isComplete: true },
          },
          updates: {
            where: { visibility: "client" },
            orderBy: { createdAt: "desc" },
            select: { title: true, message: true, createdAt: true },
          },
        },
      },
    },
  });
  if (!result || result.submitter.email.toLowerCase() !== email.toLowerCase()) return null;
  return {
    reference: result.reference,
    title: result.title,
    status: result.status,
    createdAt: result.createdAt.toISOString(),
    updatedAt: (result.engagement?.updatedAt ?? result.updatedAt).toISOString(),
    engagement: result.engagement ? {
      reference: result.engagement.reference,
      stage: result.engagement.stage,
      status: result.engagement.status,
      milestones: result.engagement.milestones.map((milestone) => ({
        title: milestone.title,
        dueDate: milestone.dueDate?.toISOString().slice(0, 10) ?? null,
        isComplete: milestone.isComplete,
      })),
      updates: result.engagement.updates.map((update) => ({
        title: update.title,
        message: update.message,
        createdAt: update.createdAt.toISOString(),
      })),
    } : null,
  };
}

export async function POST(request: Request) {
  if (!isClientPortalEnabled()) return NextResponse.json({ error: "Client portal access is currently unavailable." }, { status: 503 });
  const parsed = lookupSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid request reference and account email." }, { status: 400 });

  try {
    const result = await findRequest(parsed.data.reference, parsed.data.email);
    if (!result) return NextResponse.json({ error: "We couldn't find a request matching those details." }, { status: 404 });

    const expiresAt = Math.floor(Date.now() / 1000) + cookieLifetime;
    const payload = Buffer.from(`${result.reference}\n${parsed.data.email.toLowerCase()}\n${expiresAt}`).toString("base64url");
    const token = `${payload}.${sign(payload)}`;
    (await cookies()).set(cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/public/track",
      maxAge: cookieLifetime,
    });
    return NextResponse.json({ reference: result.reference });
  } catch (error) {
    console.error("Public request tracking lookup failed", error);
    return NextResponse.json({ error: "Tracking is temporarily unavailable. Please try again." }, { status: 500 });
  }
}

export async function GET(request: Request) {
  if (!isClientPortalEnabled()) return NextResponse.json({ error: "Client portal access is currently unavailable." }, { status: 503 });
  const reference = new URL(request.url).searchParams.get("reference")?.trim().toUpperCase();
  if (!reference || reference.length > 32) return NextResponse.json({ error: "This tracking link is invalid." }, { status: 400 });

  try {
    const token = (await cookies()).get(cookieName)?.value;
    const [payload, signature, extra] = token?.split(".") ?? [];
    if (!payload || !signature || extra) return NextResponse.json({ error: "Please verify your request details again." }, { status: 401 });

    const expected = Buffer.from(sign(payload));
    const received = Buffer.from(signature);
    if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
      return NextResponse.json({ error: "Please verify your request details again." }, { status: 401 });
    }

    const decoded = Buffer.from(payload, "base64url").toString("utf8").split("\n");
    const [tokenReference, email, expiresAt] = decoded;
    if (tokenReference !== reference || !email || Number(expiresAt) <= Math.floor(Date.now() / 1000)) {
      return NextResponse.json({ error: "Please verify your request details again." }, { status: 401 });
    }

    const result = await findRequest(reference, email);
    if (!result) return NextResponse.json({ error: "Please verify your request details again." }, { status: 401 });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Public request tracking details failed", error);
    return NextResponse.json({ error: "Tracking is temporarily unavailable. Please try again." }, { status: 500 });
  }
}
