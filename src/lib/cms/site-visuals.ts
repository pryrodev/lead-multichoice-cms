export const SITE_VISUAL_FIELDS = [
  { key: "home.marketAccess", label: "Home · Market access section", fallback: "/site/meeting.jpg" },
  { key: "home.tenders", label: "Home · Featured tenders section", fallback: "/site/warehouse.jpg" },
  { key: "home.cta", label: "Home · Conversation section", fallback: "/site/hero-port.jpg" },
  { key: "about.hero", label: "About · Hero", fallback: "/site/truck.jpg" },
  { key: "about.mission", label: "About · Mission and vision", fallback: "/site/meeting.jpg" },
  { key: "about.agency", label: "About · Agency model", fallback: "/site/warehouse.jpg" },
  { key: "about.cta", label: "About · Conversation section", fallback: "/site/hero-port.jpg" },
  { key: "services.hero", label: "Services · Hero", fallback: "/site/hero-port.jpg" },
  { key: "services.procurement", label: "Services · Procurement section", fallback: "/site/meeting.jpg" },
  { key: "services.projects", label: "Services · Project support section", fallback: "/site/warehouse.jpg" },
  { key: "services.cta", label: "Services · Conversation section", fallback: "/site/hero-port.jpg" },
  { key: "industries.hero", label: "Industries · Hero", fallback: "/site/truck.jpg" },
  { key: "industries.energy", label: "Industries · Energy section", fallback: "/site/warehouse.jpg" },
  { key: "industries.logistics", label: "Industries · Logistics section", fallback: "/site/truck.jpg" },
  { key: "industries.cta", label: "Industries · Conversation section", fallback: "/site/warehouse.jpg" },
  { key: "why.hero", label: "Why us · Hero", fallback: "/site/meeting.jpg" },
  { key: "why.agency", label: "Why us · Agency model", fallback: "/site/warehouse.jpg" },
  { key: "why.cta", label: "Why us · Conversation section", fallback: "/site/hero-port.jpg" },
  { key: "leadership.hero", label: "Leadership · Hero", fallback: "/site/meeting.jpg" },
  { key: "leadership.cta", label: "Leadership · Conversation section", fallback: "/site/hero-port.jpg" },
  { key: "marketAccess.hero", label: "Market access · Hero", fallback: "/site/hero-port.jpg" },
  { key: "marketAccess.support", label: "Market access · Support section", fallback: "/site/meeting.jpg" },
  { key: "procurement.hero", label: "Procurement · Hero", fallback: "/site/warehouse.jpg" },
  { key: "procurement.portals", label: "Procurement · Portal information", fallback: "/site/hero-port.jpg" },
  { key: "contact.hero", label: "Contact · Hero", fallback: "/site/hero-port.jpg" },
  { key: "blog.hero", label: "Blog · Hero", fallback: "/site/meeting.jpg" },
  { key: "blog.marketContext", label: "Blog · Market access article", fallback: "/site/hero-port.jpg" },
  { key: "blog.supplierReadiness", label: "Blog · Supplier readiness article", fallback: "/site/warehouse.jpg" },
  { key: "blog.deliveryCoordination", label: "Blog · Delivery coordination article", fallback: "/site/hero-port.jpg" },
  { key: "tracking.hero", label: "Tracking · Request tracking page", fallback: "/site/hero-port.jpg" },
] as const;

export type SiteVisualKey = (typeof SITE_VISUAL_FIELDS)[number]["key"];
export type SiteVisuals = Record<SiteVisualKey, string>;

export const defaultSiteVisuals = Object.fromEntries(
  SITE_VISUAL_FIELDS.map(({ key, fallback }) => [key, fallback]),
) as SiteVisuals;

export function mergeSiteVisuals(value: unknown): SiteVisuals {
  if (!value || typeof value !== "object" || Array.isArray(value)) return defaultSiteVisuals;
  const source = value as Record<string, unknown>;
  return Object.fromEntries(
    SITE_VISUAL_FIELDS.map(({ key, fallback }) => [key, typeof source[key] === "string" && source[key] ? source[key] : fallback]),
  ) as SiteVisuals;
}
