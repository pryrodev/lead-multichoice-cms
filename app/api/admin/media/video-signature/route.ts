import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/api";
import { cloudinaryConfig, cloudinarySignature } from "@/lib/cloudinary";

export async function POST() {
  const auth = await requireUser(["admin"]);
  if ("response" in auth) return auth.response;

  try {
    const { cloudName, apiKey, apiSecret } = cloudinaryConfig();
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const folder = "lead-multichoice";
    const publicId = `video-${randomBytes(16).toString("hex")}`;
    const params = { folder, public_id: publicId, timestamp };
    return NextResponse.json({
      cloudName,
      apiKey,
      timestamp,
      folder,
      publicId,
      signature: cloudinarySignature(params, apiSecret),
    }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    if (error instanceof Error && error.message === "Cloudinary is not configured.") return NextResponse.json({ error: "Set the Cloudinary environment variables to enable video uploads." }, { status: 503 });
    console.error("Video upload signature failed", error);
    return NextResponse.json({ error: "Could not start the video upload." }, { status: 500 });
  }
}
