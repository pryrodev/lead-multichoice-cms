import "server-only";

import { getDb } from "@/lib/db";

export interface CmsContentItem {
  id: "home" | "site-copy" | "site-visuals" | "procurement-resources" | "media";
  title: string;
  description: string;
  href: string;
  status: "Draft" | "Published" | "Not started" | "Asset library";
  updatedAt: string | null;
  modifiedBy: string | null;
  assetCount?: number;
}

const contentSections = [
  { id: "home", slug: "home", title: "Homepage", description: "Page sections, text, and hero image", href: "/admin/content/home" },
  { id: "site-copy", slug: "site-copy", title: "Website copy", description: "Shared page text and translations", href: "/admin/content/copy" },
  { id: "site-visuals", slug: "site-visuals", title: "Website images", description: "Hero and parallax backgrounds", href: "/admin/content/visuals" },
  { id: "procurement-resources", slug: "procurement-resources", title: "Procurement resources", description: "External procurement and tender links", href: "/admin/content/resources" },
] as const;

function contentStatus(draft: unknown, published: unknown): CmsContentItem["status"] {
  if (draft != null && JSON.stringify(draft) !== JSON.stringify(published)) return "Draft";
  if (published != null) return "Published";
  return "Not started";
}

export async function getCmsDashboardItems(): Promise<CmsContentItem[]> {
  const db = getDb();
  const [pages, assetCount, latestAsset] = await Promise.all([
    db.sitePage.findMany({
      where: { slug: { in: contentSections.map((section) => section.slug) } },
      select: {
        slug: true,
        draftContent: true,
        publishedContent: true,
        updatedAt: true,
        editor: { select: { name: true } },
      },
    }),
    db.mediaAsset.count(),
    db.mediaAsset.findFirst({
      orderBy: { createdAt: "desc" },
      select: { createdAt: true, uploader: { select: { name: true } } },
    }),
  ]);

  const pageItems = contentSections.map((section): CmsContentItem => {
    const page = pages.find((item) => item.slug === section.slug);
    return {
      id: section.id,
      title: section.title,
      description: section.description,
      href: section.href,
      status: contentStatus(page?.draftContent, page?.publishedContent),
      updatedAt: page?.updatedAt.toISOString() ?? null,
      modifiedBy: page?.editor?.name ?? null,
    };
  });

  return [
    ...pageItems,
    {
      id: "media",
      title: "Media library",
      description: "Images available to the website editors",
      href: "/admin/content/media",
      status: "Asset library",
      updatedAt: latestAsset?.createdAt.toISOString() ?? null,
      modifiedBy: latestAsset?.uploader.name ?? null,
      assetCount,
    },
  ];
}
