import { cmsLanguages, type CmsLanguage } from "@/i18n/messages";
import { translateSiteCopy } from "@/i18n/site-copy";

export const HOME_CMS_FIELDS = [
  { section: "SEO", label: "Page title", text: "Connecting International Suppliers with Purchasing Entities across Rwanda and East Africa" },
  { section: "SEO", label: "Search description", text: "Lead Multi-choice connects international manufacturers, authorized distributors and suppliers with purchasing entities in Rwanda and beyond through trade facilitation, procurement coordination, logistics and delivery support." },
  { section: "Hero", label: "Eyebrow", text: "Market Access | Supplier Engagement | Trade Facilitation" },
  { section: "Hero", label: "Main heading", text: "Connecting international suppliers with purchasing entities across Rwanda and East Africa." },
  { section: "Hero", label: "Introduction", text: "We connect international manufacturers, authorised distributors and suppliers with purchasing entities in Rwanda and beyond. We facilitate introductions and coordinate procurement, logistics, delivery and after-sales support." },
  { section: "Hero", label: "Supplier button", text: "I am an international supplier" },
  { section: "Hero", label: "Purchaser button", text: "I represent a purchasing entity" },
  { section: "Hero", label: "Supporting headline", text: "Local knowledge. Global connections." },
  { section: "Hero", label: "Supporting text", text: "Supporting commercial engagement in Rwanda and the region." },
  { section: "Company overview", label: "Section label", text: "About Us" },
  { section: "Company overview", label: "Heading", text: "A Rwanda-based partner connecting international suppliers with local entities." },
  { section: "Company overview", label: "Introduction", text: "Based in Rwanda, Lead Multi-choice connects international manufacturers, authorised distributors and suppliers with purchasing entities, institutions and commercial organizations in Rwanda and beyond." },
  { section: "Company overview", label: "Supplier card heading", text: "For international suppliers" },
  { section: "Company overview", label: "Supplier card text", text: "Understand Rwanda's procurement environment, identify relevant opportunities and reach purchasing entities through local representation." },
  { section: "Company overview", label: "Purchaser card heading", text: "For Rwanda's purchasing entities" },
  { section: "Company overview", label: "Purchaser card text", text: "Expand access to credible manufacturers, authorised distributors and specialised service providers around the world through credible representatives." },
  { section: "Our role", label: "Section label", text: "Rwanda market access" },
  { section: "Our role", label: "Heading", text: "From procurement opportunity to delivery acceptance and payment." },
  { section: "Our role", label: "Introduction", text: "We identify relevant partners, facilitate introductions, and coordinate procurement, logistics, delivery and after-sales follow-up within the agreed scope." },
  { section: "Our role", label: "Step 1 heading", text: "Identify" },
  { section: "Our role", label: "Step 1 text", text: "Assess markets and sourcing options." },
  { section: "Our role", label: "Step 2 heading", text: "Verify" },
  { section: "Our role", label: "Step 2 text", text: "Verify buyer companies and procurement rules." },
  { section: "Our role", label: "Step 3 heading", text: "Connect" },
  { section: "Our role", label: "Step 3 text", text: "Link global suppliers with local buyers." },
  { section: "Our role", label: "Step 4 heading", text: "Coordinate" },
  { section: "Our role", label: "Step 4 text", text: "Ground handling in country." },
  { section: "Procurement models", label: "Section label", text: "Procurement models" },
  { section: "Procurement models", label: "Heading", text: "Ways we support procurement and project needs." },
  { section: "Procurement models", label: "Hardware Supply title", text: "Hardware Supply" },
  { section: "Procurement models", label: "Hardware Supply description", text: "Sourcing and supply of equipment and goods to defined specifications." },
  { section: "Procurement models", label: "Framework contracts title", text: "Framework contracts" },
  { section: "Procurement models", label: "Framework contracts description", text: "Supply under agreed terms and call-off requirements." },
  { section: "Procurement models", label: "EPC turnkey contracts title", text: "EPC turnkey contracts" },
  { section: "Procurement models", label: "EPC turnkey contracts description", text: "Engineering, procurement and construction coordinated through project handover." },
  { section: "Procurement models", label: "Consultancy / urgency title", text: "Consultancy / urgency" },
  { section: "Procurement models", label: "Consultancy / urgency description", text: "Professional advice and support for urgent procurement needs." },
  { section: "Services", label: "Section label", text: "What we do" },
  { section: "Services", label: "Heading", text: "Local coordination across the global supply chain." },
  { section: "Services", label: "All services link", text: "Explore all services" },
  { section: "Services", label: "Service 1 heading", text: "Market Access & Trade Facilitation" },
  { section: "Services", label: "Service 1 text", text: "Identify relevant opportunities and purchasing entities, facilitate introductions and provide local representation." },
  { section: "Services", label: "Service 2 heading", text: "Procurement & Supply Chain Coordination" },
  { section: "Services", label: "Service 2 text", text: "Identify suppliers and coordinate procurement communication, order follow-up and delivery." },
  { section: "Services", label: "Service 3 heading", text: "Logistics, Distribution & Trade Compliance Support" },
  { section: "Services", label: "Service 3 text", text: "Coordinate transport, shipment tracking, customs liaison, import documents and delivery follow-up." },
  { section: "Procurement resources", label: "Section label", text: "Selected opportunities" },
  { section: "Procurement resources", label: "Heading", text: "Explore procurement opportunities." },
  { section: "Procurement resources", label: "Introduction", text: "Review selected tender and consultancy listings published on Job in Rwanda." },
] as const;

export const HOME_SECTION_NAV_ITEMS = [
  { id: "overview", anchor: "home-hero", label: "Overview" },
  { id: "partners", anchor: "home-partners", label: "Partners" },
  { id: "about", anchor: "home-about", label: "About Us" },
  { id: "models", anchor: "home-models", label: "Procurement models" },
  { id: "market-access", anchor: "home-market-access", label: "Rwanda market access" },
  { id: "services", anchor: "home-services", label: "What we do" },
  { id: "opportunities", anchor: "home-opportunities", label: "Selected opportunities" },
  { id: "blog", anchor: "home-blog", label: "Blog" },
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
