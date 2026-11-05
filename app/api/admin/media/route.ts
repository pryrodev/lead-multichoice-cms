import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/api";
import { getDb } from "@/lib/db";
import { cloudinaryConfig, cloudinarySignature } from "@/lib/cloudinary";

export const runtime = "nodejs";
const maxUploadBytes = 10 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export async function GET() {
  const auth = await requireUser(["admin"]); if ("response" in auth) return auth.response;
  try {
    const rows = await getDb().mediaAsset.findMany({ orderBy: { createdAt: "desc" }, take: 500 });
    return NextResponse.json(rows.map(({ publicId, secureUrl, altText, createdAt, ...row }) => ({ ...row, publicId, secureUrl, altText, createdAt: createdAt.toISOString() })));
  } catch (error) { console.error("Media library query failed", error); return NextResponse.json({ error: "Could not load the media library." }, { status: 500 }); }
}

export async function POST(request: Request) {
  const auth = await requireUser(["admin"]); if ("response" in auth) return auth.response;
  let form: FormData;
  try { form = await request.formData(); } catch { return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 }); }
  const file = form.get("file");
  const altText = z.string().trim().max(500).safeParse(form.get("altText") ?? "");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
  if (!allowedTypes.has(file.type)) return NextResponse.json({ error: "Use a JPG, PNG, WebP, or AVIF image." }, { status: 415 });
  if (file.size <= 0 || file.size > maxUploadBytes) return NextResponse.json({ error: "Images must be smaller than 10 MB." }, { status: 413 });
  if (!altText.success) return NextResponse.json({ error: "Alt text must be 500 characters or fewer." }, { status: 400 });

  try {
    const { cloudName, apiKey, apiSecret } = cloudinaryConfig();
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const publicId = `cms/${randomBytes(16).toString("hex")}`;
    const params = { folder: "lead-multichoice", public_id: publicId, timestamp };
    const body = new FormData();
    body.set("file", file);
    body.set("api_key", apiKey);
    body.set("folder", params.folder);
    body.set("public_id", params.public_id);
    body.set("timestamp", params.timestamp);
    body.set("signature", cloudinarySignature(params, apiSecret));
    const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body, cache: "no-store" });
    const uploaded = await uploadResponse.json().catch(() => null) as { secure_url?: string; public_id?: string; format?: string; bytes?: number; width?: number; height?: number; error?: { message?: string } } | null;
    if (!uploadResponse.ok || !uploaded?.secure_url || !uploaded.public_id) {
      console.error("Cloudinary upload rejected", uploaded?.error?.message ?? uploadResponse.status);
      return NextResponse.json({ error: "Cloudinary could not process this image." }, { status: 502 });
    }
    const id = randomBytes(16).toString("hex");
    const asset = await getDb().mediaAsset.create({ data: { id, publicId: uploaded.public_id, secureUrl: uploaded.secure_url, format: uploaded.format ?? "", bytes: uploaded.bytes ?? file.size, width: uploaded.width ?? 0, height: uploaded.height ?? 0, altText: altText.data, uploadedBy: auth.user.id } });
    return NextResponse.json({ id: asset.id, publicId: asset.publicId, secureUrl: asset.secureUrl, format: asset.format, bytes: asset.bytes, width: asset.width, height: asset.height, altText: asset.altText, createdAt: asset.createdAt.toISOString() }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Cloudinary is not configured.") return NextResponse.json({ error: "Set the Cloudinary environment variables to enable media uploads." }, { status: 503 });
    console.error("Media upload failed", error);
    return NextResponse.json({ error: "Could not save this image." }, { status: 500 });
  }
}
