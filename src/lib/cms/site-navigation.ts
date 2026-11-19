import type { SeoPageId } from "./site-seo";

export interface SiteNavigationLink {
  id: string;
  pageId: Exclude<SeoPageId, "home">;
  label: string;
}

export interface SiteNavigationGroup {
  id: string;
  label: string;
  links: SiteNavigationLink[];
}

export interface SiteNavigationContent {
  groups: SiteNavigationGroup[];
}

export const defaultSiteNavigation: SiteNavigationContent = {
  groups: [
    { id: "company", label: "Company", links: [
      { id: "about", pageId: "about", label: "About Us" },
      { id: "why-us", pageId: "why-us", label: "Why Choose Us" },
      { id: "leadership", pageId: "leadership", label: "Leadership" },
    ] },
    { id: "solutions", label: "Solutions", links: [
      { id: "services", pageId: "services", label: "Services" },
      { id: "industries", pageId: "industries", label: "Industries" },
    ] },
    { id: "opportunities", label: "Opportunities", links: [
      { id: "market-access-investment", pageId: "market-access-investment", label: "Market Access & Investment" },
      { id: "procurement-opportunities", pageId: "procurement-opportunities", label: "Procurement Opportunities" },
    ] },
    { id: "publications", label: "Publications", links: [
      { id: "blog", pageId: "blog", label: "Blog" },
      { id: "media", pageId: "media", label: "Media" },
    ] },
  ],
};

export function mergeSiteNavigation(value: unknown): SiteNavigationContent {
  if (!value || typeof value !== "object" || Array.isArray(value)) return defaultSiteNavigation;
  const source = value as { groups?: unknown };
  if (!Array.isArray(source.groups)) return defaultSiteNavigation;
  const groups = source.groups.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as Record<string, unknown>;
    if (typeof row["id"] !== "string" || typeof row["label"] !== "string" || !Array.isArray(row["links"])) return [];
    const links = row["links"].flatMap((link) => {
      if (!link || typeof link !== "object") return [];
      const entry = link as Record<string, unknown>;
      if (typeof entry["id"] !== "string" || typeof entry["pageId"] !== "string" || typeof entry["label"] !== "string") return [];
      if (entry["pageId"] === "home" || !defaultSiteNavigation.groups.some((group) => group.links.some((allowed) => allowed.pageId === entry["pageId"]))) return [];
      return [{ id: entry["id"], pageId: entry["pageId"] as SiteNavigationLink["pageId"], label: entry["label"] }];
    });
    return [{ id: row["id"], label: row["label"], links }];
  });
  return groups.length ? { groups } : defaultSiteNavigation;
}
