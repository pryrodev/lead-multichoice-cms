import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/api";
import { getDb } from "@/lib/db";
import { cloudinaryConfig, cloudinarySignature } from "@/lib/cloudinary";

export async function DELETE(_request: Request, context: { params: Promise<{ mediaId: string }> }) {
  const auth = await requireUser(["admin"]); if ("response" in auth) return auth.response;
  const { mediaId } = await context.params;
  try {
    const asset = await getDb().mediaAsset.findUnique({ where: { id: mediaId }, select: { publicId: true } });
    if (!asset) return NextResponse.json({ error: "Image not found." }, { status: 404 });
    const { cloudName, apiKey, apiSecret } = cloudinaryConfig();
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const params = { public_id: asset.publicId, timestamp };
    const body = new URLSearchParams({ ...params, api_key: apiKey, signature: cloudinarySignature(params, apiSecret) });
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, { method: "POST", body, cache: "no-store" });
    const result = await response.json().catch(() => null) as { result?: string } | null;
    if (!response.ok || (result?.result !== "ok" && result?.result !== "not found")) return NextResponse.json({ error: "Cloudinary could not delete this image." }, { status: 502 });
    await getDb().mediaAsset.delete({ where: { id: mediaId } });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Cloudinary is not configured.") return NextResponse.json({ error: "Set the Cloudinary environment variables to manage media." }, { status: 503 });
    console.error("Media delete failed", error);
    return NextResponse.json({ error: "Could not delete this image." }, { status: 500 });
  }
}
