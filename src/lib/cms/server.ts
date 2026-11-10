import "server-only";
import { unstable_cache } from "next/cache";
import { getDb } from "@/lib/db";
import { defaultHomePageContent, mergeHomePageContent, type HomePageContent } from "./homepage";
import { defaultSiteVisuals, mergeSiteVisuals, type SiteVisuals } from "./site-visuals";
import { mergeSiteCopy, type SiteCopyContent } from "./site-copy";
import { defaultProcurementResources, mergeProcurementResources, type ProcurementResourcesContent } from "./procurement-resources";

export const getPublishedHomePage = unstable_cache(async (): Promise<HomePageContent> => {
  try {
    const page = await getDb().sitePage.findUnique({ where: { slug: "home" }, select: { publishedContent: true } });
    const stored = page?.publishedContent;
    if (typeof stored === "string") return mergeHomePageContent(JSON.parse(stored));
    return stored ? mergeHomePageContent(stored) : defaultHomePageContent;
  } catch (error) {
    console.error("Could not load published homepage content", error);
    return defaultHomePageContent;
  }
}, ["published-home-page-v1"], { revalidate: 3600, tags: ["cms-homepage"] });

export const getPublishedSiteVisuals = unstable_cache(async (): Promise<SiteVisuals> => {
  try {
    const page = await getDb().sitePage.findUnique({ where: { slug: "site-visuals" }, select: { publishedContent: true } });
    const stored = page?.publishedContent;
    const content = typeof stored === "string" ? JSON.parse(stored) as unknown : stored;
    return content ? mergeSiteVisuals(content) : defaultSiteVisuals;
  } catch (error) {
    console.error("Could not load published site visuals", error);
    return defaultSiteVisuals;
  }
}, ["published-site-visuals-v1"], { revalidate: 3600, tags: ["cms-site-visuals"] });

export const getPublishedSiteCopy = unstable_cache(async (): Promise<SiteCopyContent | null> => {
  try {
    const page = await getDb().sitePage.findUnique({ where: { slug: "site-copy" }, select: { publishedContent: true } });
    const stored = page?.publishedContent;
    const content = typeof stored === "string" ? JSON.parse(stored) as unknown : stored;
    return content ? mergeSiteCopy(content) : null;
  } catch (error) {
    console.error("Could not load published site copy", error);
    return null;
  }
}, ["published-site-copy-v1"], { revalidate: 3600, tags: ["cms-site-copy"] });

export const getPublishedProcurementResources = unstable_cache(async (): Promise<ProcurementResourcesContent> => {
  try {
    const page = await getDb().sitePage.findUnique({ where: { slug: "procurement-resources" }, select: { publishedContent: true } });
    const stored = page?.publishedContent;
    const content = typeof stored === "string" ? JSON.parse(stored) as unknown : stored;
    return content ? mergeProcurementResources(content) : defaultProcurementResources;
  } catch (error) {
    console.error("Could not load published procurement resources", error);
    return defaultProcurementResources;
  }
}, ["published-procurement-resources-v1"], { revalidate: 3600, tags: ["cms-procurement-resources"] });
