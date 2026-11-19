import type { Metadata } from "next";
import MediaPage from "@/components/site/pages/media";
import { getPublishedMediaGallery } from "@/lib/cms/server";
import { getPublicPageMetadata } from "@/lib/cms/metadata";

export async function generateMetadata(): Promise<Metadata> { return getPublicPageMetadata("media"); }

export default async function Page() {
  const { stories } = await getPublishedMediaGallery();
  return <MediaPage stories={stories} />;
}
