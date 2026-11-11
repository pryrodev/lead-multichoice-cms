import "server-only";
import { unstable_cache } from "next/cache";
import { getDb } from "@/lib/db";
import { defaultHomePageContent, mergeHomePageContent, type HomePageContent } from "./homepage";
import { defaultSiteVisuals, mergeSiteVisuals, type SiteVisuals } from "./site-visuals";
import { mergeSiteCopy, type SiteCopyContent } from "./site-copy";
import { defaultProcurementResources, mergeProcurementResources, type ProcurementResourcesContent } from "./procurement-resources";

const isProductionBuild = () => process.env["NEXT_PHASE"] === "phase-production-build";

const handleCmsDbError = (context: string, error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  if (
    message.includes("pool failed to retrieve a connection") ||
    message.includes("ECONNREFUSED") ||
    message.includes("Can't reach database server") ||
    message.includes("45028")
  ) {
    console.warn(`[CMS] Database not reachable (${context}). Using fallback default content.`);
  } else {
    console.error(`[CMS] Could not load ${context}:`, error);
  }
};

const loadPublishedHomePage = async (): Promise<HomePageContent> => {
  try {
    const page = await getDb().sitePage.findUnique({ where: { slug: "home" }, select: { publishedContent: true } });
    const stored = page?.publishedContent;
    if (typeof stored === "string") return mergeHomePageContent(JSON.parse(stored));
    return stored ? mergeHomePageContent(stored) : defaultHomePageContent;
  } catch (error) {
    handleCmsDbError("published homepage content", error);
    return defaultHomePageContent;
  }
};
const cachedPublishedHomePage = unstable_cache(loadPublishedHomePage, ["published-home-page-v1"], { revalidate: 3600, tags: ["cms-homepage"] });
export const getPublishedHomePage = () => isProductionBuild() ? Promise.resolve(defaultHomePageContent) : cachedPublishedHomePage();

const loadPublishedSiteVisuals = async (): Promise<SiteVisuals> => {
  try {
    const page = await getDb().sitePage.findUnique({ where: { slug: "site-visuals" }, select: { publishedContent: true } });
    const stored = page?.publishedContent;
    const content = typeof stored === "string" ? JSON.parse(stored) as unknown : stored;
    return content ? mergeSiteVisuals(content) : defaultSiteVisuals;
  } catch (error) {
    handleCmsDbError("published site visuals", error);
    return defaultSiteVisuals;
  }
};
const cachedPublishedSiteVisuals = unstable_cache(loadPublishedSiteVisuals, ["published-site-visuals-v1"], { revalidate: 3600, tags: ["cms-site-visuals"] });
export const getPublishedSiteVisuals = () => isProductionBuild() ? Promise.resolve(defaultSiteVisuals) : cachedPublishedSiteVisuals();

const loadPublishedSiteCopy = async (): Promise<SiteCopyContent | null> => {
  try {
    const page = await getDb().sitePage.findUnique({ where: { slug: "site-copy" }, select: { publishedContent: true } });
    const stored = page?.publishedContent;
    const content = typeof stored === "string" ? JSON.parse(stored) as unknown : stored;
    return content ? mergeSiteCopy(content) : null;
  } catch (error) {
    handleCmsDbError("published site copy", error);
    return null;
  }
};
const cachedPublishedSiteCopy = unstable_cache(loadPublishedSiteCopy, ["published-site-copy-v1"], { revalidate: 3600, tags: ["cms-site-copy"] });
export const getPublishedSiteCopy = () => isProductionBuild() ? Promise.resolve(null) : cachedPublishedSiteCopy();

const loadPublishedProcurementResources = async (): Promise<ProcurementResourcesContent> => {
  try {
    const page = await getDb().sitePage.findUnique({ where: { slug: "procurement-resources" }, select: { publishedContent: true } });
    const stored = page?.publishedContent;
    const content = typeof stored === "string" ? JSON.parse(stored) as unknown : stored;
    return content ? mergeProcurementResources(content) : defaultProcurementResources;
  } catch (error) {
    handleCmsDbError("published procurement resources", error);
    return defaultProcurementResources;
  }
};
const cachedPublishedProcurementResources = unstable_cache(loadPublishedProcurementResources, ["published-procurement-resources-v1"], { revalidate: 3600, tags: ["cms-procurement-resources"] });
export const getPublishedProcurementResources = () => isProductionBuild() ? Promise.resolve(defaultProcurementResources) : cachedPublishedProcurementResources();
