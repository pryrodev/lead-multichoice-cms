import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";

export async function GET() {
  try {
    return NextResponse.json({ user: await getSessionUser() });
  } catch (error) {
    console.error("Session lookup failed", error);
    return NextResponse.json({ error: "Authentication service unavailable." }, { status: 503 });
  }
}
