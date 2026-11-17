import { cmsLanguages, type CmsLanguage } from "@/i18n/messages";
import { translateSiteCopy } from "@/i18n/site-copy";

export const HOME_CMS_FIELDS = [
  { section: "SEO", label: "Page title", text: "Connecting International Suppliers with Purchasing Entities across Rwanda and East Africa" },
  { section: "SEO", label: "Search description", text: "Lead Multi-choice connects international manufacturers, authorized distributors and suppliers with purchasing entities in Rwanda and beyond through trade facilitation, procurement coordination, logistics and delivery support." },
  { section: "Hero", label: "Eyebrow", text: "Market Access | Supplier Engagement | Trade Facilitation" },
  { section: "Hero", label: "Main heading", text: "Connecting international suppliers with purchasing entities across Rwanda and East Africa." },
  { section: "Hero", label: "Introduction", text: "We connect international manufacturers, authorised distributors and suppliers with purchasing entities in Rwanda and beyond. We facilitate introductions and coordinate procurement, logistics, delivery and after-sales support." },
  { section: "Hero", label: "Supporting headline", text: "Local knowledge. Global connections." },
  { section: "Hero", label: "Supporting text", text: "Supporting commercial engagement in Rwanda and the region." },
  { section: "Our role", label: "Section label", text: "Rwanda market access" },
  { section: "Our role", label: "Heading", text: "From procurement opportunity to delivery acceptance and payment." },
  { section: "Our role", label: "Introduction", text: "We identify relevant opportunities, connect with manufacturers, and coordinate procurement, logistics, delivery, and after-sales services." },
  { section: "Our role", label: "Step 1 heading", text: "Identify" },
  { section: "Our role", label: "Step 1 text", text: "Assess markets and sourcing options." },
  { section: "Our role", label: "Step 2 heading", text: "Verify" },
  { section: "Our role", label: "Step 2 text", text: "Verify buyer companies and procurement rules." },
  { section: "Our role", label: "Step 3 heading", text: "Connect" },
  { section: "Our role", label: "Step 3 text", text: "Link global suppliers with local buyers." },
  { section: "Our role", label: "Step 4 heading", text: "Coordinate" },
  { section: "Our role", label: "Step 4 text", text: "Ground handling in country." },
  { section: "Procurement models", label: "Section label", text: "Procurement models" },
  { section: "Procurement models", label: "Heading", text: "Support for procurement and project needs." },
  { section: "Procurement models", label: "Supply contract title", text: "Supply contract" },
  { section: "Procurement models", label: "Supply contract description", text: "Sourcing and supply of equipment and goods to defined specifications." },
  { section: "Procurement models", label: "Framework contracts title", text: "Framework contracts" },
  { section: "Procurement models", label: "Framework contracts description", text: "Supply under agreed terms and call-off requirements." },
  { section: "Procurement models", label: "EPC turnkey contracts title", text: "EPC turnkey contracts" },
  { section: "Procurement models", label: "EPC turnkey contracts description", text: "Engineering, procurement and construction coordinated through project handover." },
  { section: "Procurement models", label: "Consultancy / urgency title", text: "Consultancy / urgency" },
  { section: "Procurement models", label: "Consultancy / urgency description", text: "Professional advice and support for urgent procurement needs." },
  { section: "Services", label: "Section label", text: "What we do" },
  { section: "Services", label: "Heading", text: "Procurement and deal acceleration." },
  { section: "Services", label: "All services link", text: "Explore all services" },
  { section: "Services", label: "Service 1 heading", text: "Market Access" },
  { section: "Services", label: "Service 1 text", text: "Connect purchasing entities with manufacturers." },
  { section: "Services", label: "Service 2 heading", text: "Supply chain coordination" },
  { section: "Services", label: "Service 2 text", text: "Coordinate procurement, supplier communication, and delivery." },
  { section: "Services", label: "Service 3 heading", text: "Ground handling and trade compliance support" },
  { section: "Services", label: "Service 3 text", text: "Coordinate in-country handling and support trade compliance." },
] as const;

export const HOME_SECTION_NAV_ITEMS = [
  { id: "overview", anchor: "home-hero", label: "Overview" },
  { id: "models", anchor: "home-models", label: "Procurement models" },
  { id: "market-access", anchor: "home-market-access", label: "Rwanda market access" },
  { id: "services", anchor: "home-services", label: "What we do" },
  { id: "contact", anchor: "home-contact", label: "Start a conversation" },
] as const;

export type HomeCopyText = (typeof HOME_CMS_FIELDS)[number]["text"];
export type HomeSectionNavId = (typeof HOME_SECTION_NAV_ITEMS)[number]["id"];
export type HomePageContent = {
  translations: Record<CmsLanguage, Record<HomeCopyText, string>>;
  homeMenuLabels: Record<HomeSectionNavId, string>;
  heroImageUrl: string;
  homeMenuEnabledIds: string[];
};

const copyTexts = [...new Set(HOME_CMS_FIELDS.map((field) => field.text))] as HomeCopyText[];

export const defaultHomePageContent: HomePageContent = {
  translations: Object.fromEntries(
    cmsLanguages.map((language) => [
      language,
      Object.fromEntries(copyTexts.map((text) => [
        text,
        translateSiteCopy(language, text),
      ])),
    ]),
  ) as HomePageContent["translations"],
  homeMenuLabels: Object.fromEntries(HOME_SECTION_NAV_ITEMS.map((item) => [item.id, item.label])) as HomePageContent["homeMenuLabels"],
  heroImageUrl: "/site/hero-port.jpg",
  homeMenuEnabledIds: HOME_SECTION_NAV_ITEMS.map((item) => item.id),
};

/** Keep published and draft CMS documents compatible as homepage fields evolve. */
export function mergeHomePageContent(value: unknown): HomePageContent {
  if (!value || typeof value !== "object") return defaultHomePageContent;

  const stored = value as {
    heroImageUrl?: unknown;
    homeMenuEnabledIds?: unknown;
    homeMenuLabels?: unknown;
    translations?: Partial<Record<CmsLanguage, unknown>>;
  };
  const translations = Object.fromEntries(cmsLanguages.map((language) => {
    const savedLanguage = stored.translations?.[language];
    const savedCopy = savedLanguage && typeof savedLanguage === "object"
      ? savedLanguage as Record<string, string>
      : {};
    return [language, { ...defaultHomePageContent.translations[language], ...savedCopy }];
  })) as HomePageContent["translations"];
  const savedLabels = stored.homeMenuLabels && typeof stored.homeMenuLabels === "object"
    ? stored.homeMenuLabels as Record<string, string>
    : {};
  const homeMenuLabels = { ...defaultHomePageContent.homeMenuLabels, ...savedLabels } as HomePageContent["homeMenuLabels"];
  const storedMenuIds = Array.isArray(stored.homeMenuEnabledIds)
    ? stored.homeMenuEnabledIds
    : null;

  return {
    translations,
    homeMenuLabels,
    homeMenuEnabledIds: storedMenuIds
      ? HOME_SECTION_NAV_ITEMS
          .filter((item) => storedMenuIds.includes(item.id))
          .map((item) => item.id)
      : defaultHomePageContent.homeMenuEnabledIds,
    heroImageUrl: typeof stored.heroImageUrl === "string" && stored.heroImageUrl.length > 0
      ? stored.heroImageUrl
      : defaultHomePageContent.heroImageUrl,
  };
}
