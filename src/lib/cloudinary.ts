import "server-only";
import { createHash } from "node:crypto";

export function cloudinaryConfig() {
  const cloudName = process.env["CLOUDINARY_CLOUD_NAME"];
  const apiKey = process.env["CLOUDINARY_API_KEY"];
  const apiSecret = process.env["CLOUDINARY_API_SECRET"];
  if (!cloudName || !apiKey || !apiSecret) throw new Error("Cloudinary is not configured.");
  return { cloudName, apiKey, apiSecret };
}

export function cloudinarySignature(params: Record<string, string>, apiSecret: string) {
  const canonical = Object.keys(params).sort().map((key) => `${key}=${params[key]}`).join("&");
  return createHash("sha1").update(`${canonical}${apiSecret}`).digest("hex");
}
