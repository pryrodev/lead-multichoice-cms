import type { Metadata } from "next";
import { getPublishedSiteSeo } from "@/lib/cms/server";
import { getSeoPath, type SeoPageId } from "@/lib/cms/site-seo";

export async function getPublicPageMetadata(pageId: SeoPageId): Promise<Metadata> {
  const content = await getPublishedSiteSeo();
  const page = content.pages.find((entry) => entry.pageId === pageId);
  if (!page) return {};
  return {
    title: page.seoTitle,
    description: page.seoDescription,
    alternates: { canonical: getSeoPath(pageId, content) },
    openGraph: { title: page.seoTitle, description: page.seoDescription, type: "website" },
  };
}
