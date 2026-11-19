export const seoPages = [
  { id: "home", label: "Home", slug: "", fallbackTitle: "Connecting International Suppliers with Purchasing Entities across Rwanda and East Africa", fallbackDescription: "Lead Multi-Choice connects international manufacturers, authorised distributors and suppliers with purchasing entities in Rwanda and beyond." },
  { id: "about", label: "About Us", slug: "about", fallbackTitle: "About Us", fallbackDescription: "Learn about Lead Multi-Choice, its work connecting suppliers and purchasing entities, and its role in Rwanda and the region." },
  { id: "market-access-investment", label: "Market Access & Investment", slug: "market-access-investment", fallbackTitle: "Market Access & Investment", fallbackDescription: "Market access support connecting international businesses with purchasing entities and opportunities in Rwanda and the region." },
  { id: "services", label: "Services", slug: "services", fallbackTitle: "Services", fallbackDescription: "Market access, procurement coordination, logistics, project implementation and after-sales support." },
  { id: "industries", label: "Industries", slug: "industries", fallbackTitle: "Industries", fallbackDescription: "Sourcing and coordination support across healthcare, energy, general supplies, logistics and projects." },
  { id: "why-us", label: "Why Choose Us", slug: "why-us", fallbackTitle: "Why Choose Us", fallbackDescription: "Local understanding, ethical representation, reliable coordination and accountable follow-up." },
  { id: "leadership", label: "Leadership", slug: "leadership", fallbackTitle: "Leadership", fallbackDescription: "Meet the leadership guiding Lead Multi-Choice's trade facilitation and business coordination work." },
  { id: "procurement-opportunities", label: "Procurement Opportunities", slug: "procurement-opportunities", fallbackTitle: "Strategic Sourcing & Procurement Opportunities", fallbackDescription: "Strategic sourcing and procurement coordination connecting purchasing entities with credible suppliers." },
  { id: "blog", label: "Blog", slug: "blog", fallbackTitle: "Blog", fallbackDescription: "Practical notes on trade, sourcing, procurement and delivery coordination." },
  { id: "media", label: "Media", slug: "media", fallbackTitle: "Media Gallery", fallbackDescription: "Stories and images from trade facilitation, supplier engagement and logistics." },
  { id: "contact", label: "Contact", slug: "contact", fallbackTitle: "Contact Us", fallbackDescription: "Contact Lead Multi-Choice to discuss suppliers, procurement and business opportunities in Rwanda." },
  { id: "track", label: "Tracking", slug: "track", fallbackTitle: "Track a Request", fallbackDescription: "Check the latest progress shared by the Lead Multi-Choice team using your Tracking ID." },
] as const;

export type SeoPageId = (typeof seoPages)[number]["id"];
export type SiteSeoEntry = { pageId: SeoPageId; slug: string; seoTitle: string; seoDescription: string };
export type SiteSeoContent = { pages: SiteSeoEntry[] };

export const defaultSiteSeoContent: SiteSeoContent = {
  pages: seoPages.map(({ id, slug, fallbackTitle, fallbackDescription }) => ({
    pageId: id,
    slug,
    seoTitle: fallbackTitle,
    seoDescription: fallbackDescription,
  })),
};

export function mergeSiteSeo(value: unknown): SiteSeoContent {
  if (!value || typeof value !== "object" || Array.isArray(value)) return defaultSiteSeoContent;
  const rows = (value as { pages?: unknown }).pages;
  if (!Array.isArray(rows)) return defaultSiteSeoContent;
  const valid = new Map<string, SiteSeoEntry>();
  for (const row of rows) {
    if (!row || typeof row !== "object") continue;
    const entry = row as Record<string, unknown>;
    if (typeof entry["pageId"] !== "string" || !seoPages.some((page) => page.id === entry["pageId"])) continue;
    if (["slug", "seoTitle", "seoDescription"].some((key) => typeof entry[key] !== "string")) continue;
    valid.set(entry["pageId"], entry as SiteSeoEntry);
  }
  return { pages: defaultSiteSeoContent.pages.map((fallback) => valid.get(fallback.pageId) ?? fallback) };
}

export function getSeoPath(pageId: SeoPageId, content: SiteSeoContent): string {
  const slug = content.pages.find((page) => page.pageId === pageId)?.slug ?? "";
  return pageId === "home" ? "/" : `/${slug}`;
}
