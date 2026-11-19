import { mediaStories, type MediaStory } from "@/content/media-gallery";

export interface MediaGalleryContent {
  stories: Array<MediaStory & { id: string }>;
}

export const defaultMediaGallery: MediaGalleryContent = {
  stories: mediaStories.map((story, index) => ({ ...story, id: `story-${index + 1}` })),
};

export function mergeMediaGallery(value: unknown): MediaGalleryContent {
  if (!value || typeof value !== "object" || Array.isArray(value)) return defaultMediaGallery;
  const rows = (value as { stories?: unknown }).stories;
  if (!Array.isArray(rows)) return defaultMediaGallery;
  const stories = rows.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as Record<string, unknown>;
    if (typeof row["id"] !== "string" || typeof row["image"] !== "string") return [];
    const localeMap = (value: unknown): value is Record<string, string> =>
      Boolean(value && typeof value === "object" && !Array.isArray(value) && Object.values(value).every((entry) => typeof entry === "string"));
    if (!["alt", "category", "title", "description"].every((key) => localeMap(row[key]))) return [];
    return [{ id: row["id"], image: row["image"], alt: row["alt"] as MediaStory["alt"], category: row["category"] as MediaStory["category"], title: row["title"] as MediaStory["title"], description: row["description"] as MediaStory["description"] }];
  });
  return { stories };
}
