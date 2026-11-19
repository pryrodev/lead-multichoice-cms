"use client";

import { MediaCoverflow } from "@/components/site/MediaCoverflow";
import type { MediaGalleryContent } from "@/lib/cms/media-gallery";

export default function MediaPage({ stories }: { stories: MediaGalleryContent["stories"] }) {
  return <MediaCoverflow stories={stories} />;
}
