import "server-only";
import { getDb } from "@/lib/db";
import { defaultHomePageContent, type HomePageContent } from "./homepage";
import { defaultSiteVisuals, mergeSiteVisuals, type SiteVisuals } from "./site-visuals";
import { mergeSiteCopy, type SiteCopyContent } from "./site-copy";

export async function getPublishedHomePage(): Promise<HomePageContent> {
  try {
    const page = await getDb().sitePage.findUnique({ where: { slug: "home" }, select: { publishedContent: true } });
    const stored = page?.publishedContent;
    if (typeof stored === "string") return JSON.parse(stored) as HomePageContent;
    return (stored as HomePageContent | null) ?? defaultHomePageContent;
  } catch (error) {
    console.error("Could not load published homepage content", error);
    return defaultHomePageContent;
  }
}

export async function getPublishedSiteVisuals(): Promise<SiteVisuals> {
  try {
    const page = await getDb().sitePage.findUnique({ where: { slug: "site-visuals" }, select: { publishedContent: true } });
    const stored = page?.publishedContent;
    const content = typeof stored === "string" ? JSON.parse(stored) as unknown : stored;
    return content ? mergeSiteVisuals(content) : defaultSiteVisuals;
  } catch (error) {
    console.error("Could not load published site visuals", error);
    return defaultSiteVisuals;
  }
}

export async function getPublishedSiteCopy(): Promise<SiteCopyContent | null> {
  try {
    const page = await getDb().sitePage.findUnique({ where: { slug: "site-copy" }, select: { publishedContent: true } });
    const stored = page?.publishedContent;
    const content = typeof stored === "string" ? JSON.parse(stored) as unknown : stored;
    return content ? mergeSiteCopy(content) : null;
  } catch (error) {
    console.error("Could not load published site copy", error);
    return null;
  }
}
