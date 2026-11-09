import type { Language } from "@/i18n/messages";
import { translateSiteCopy } from "@/i18n/site-copy";

export const HOME_CMS_FIELDS = [
  { section: "SEO", text: "Connecting International Suppliers with Purchasing Entities across Rwanda and East Africa" },
  { section: "SEO", text: "Lead Multichoice connects international manufacturers, authorized distributors and suppliers with purchasing entities in Rwanda and the wider East African region through trade facilitation, procurement coordination, logistics and delivery support." },
  { section: "Hero", text: "Market Access | Supplier Engagement | Trade Facilitation" },
  { section: "Hero", text: "Connecting international suppliers with purchasing entities across Rwanda and East Africa." },
  { section: "Hero", text: "We connect international manufacturers, authorised distributors and suppliers with purchasing entities in Rwanda and the wider East African region. We facilitate introductions and coordinate procurement, logistics, delivery and after-sales support." },
  { section: "Hero", text: "I am an international supplier" },
  { section: "Hero", text: "I represent a purchasing entity" },
  { section: "Hero", text: "Local knowledge. Global connections." },
  { section: "Hero", text: "Supporting commercial engagement in Rwanda and the region." },
  { section: "Company overview", text: "About Us" },
  { section: "Company overview", text: "A Rwanda-based partner connecting international suppliers with local entities." },
  { section: "Company overview", text: "Based in Rwanda, Lead Multichoice connects international manufacturers, authorised distributors and suppliers with purchasing entities, institutions and commercial organizations in Rwanda and the wider East African region." },
  { section: "Company overview", text: "For international suppliers" },
  { section: "Company overview", text: "Understand Rwanda's procurement environment, identify relevant opportunities and reach purchasing entities through local representation." },
  { section: "Company overview", text: "For Rwanda's purchasing entities" },
  { section: "Company overview", text: "Expand access to credible manufacturers, authorised distributors and specialised service providers around the world through credible representatives." },
  { section: "Our role", text: "Rwanda market access" },
  { section: "Our role", text: "From procurement opportunity to delivery acceptance and payment." },
  { section: "Our role", text: "We identify relevant partners, facilitate introductions, and coordinate procurement, logistics, delivery and after-sales follow-up within the agreed scope." },
  { section: "Our role", text: "Identify" },
  { section: "Our role", text: "Assess markets and sourcing options." },
  { section: "Our role", text: "Verify" },
  { section: "Our role", text: "Vet buyer companies and procurement rules." },
  { section: "Our role", text: "Connect" },
  { section: "Our role", text: "Link global suppliers with local buyers." },
  { section: "Our role", text: "Coordinate" },
  { section: "Our role", text: "Ground handling in country." },
  { section: "Services", text: "What we do" },
  { section: "Services", text: "Local coordination across the global supply chain." },
  { section: "Services", text: "Explore all services" },
  { section: "Services", text: "Market Access & Trade Facilitation" },
  { section: "Services", text: "Identify relevant opportunities and purchasing entities, facilitate introductions and provide local representation." },
  { section: "Services", text: "Procurement & Supply Chain Coordination" },
  { section: "Services", text: "Identify suppliers and coordinate procurement communication, order follow-up and delivery." },
  { section: "Services", text: "Logistics, Distribution & Trade Compliance Support" },
  { section: "Services", text: "Coordinate transport, shipment tracking, customs liaison, import documents and delivery follow-up." },
  { section: "Procurement resources", text: "Official procurement portals" },
  { section: "Procurement resources", text: "Explore procurement notices at the source." },
  { section: "Procurement resources", text: "Visit Rwanda's official procurement portals to review current notices, documents and deadlines." },
  { section: "Procurement resources", text: "Official procurement portal" },
  { section: "Procurement resources", text: "Medical and healthcare supply tenders." },
  { section: "Procurement resources", text: "Visit RMS Tenders" },
  { section: "Procurement resources", text: "Rwanda's official government tenders portal." },
  { section: "Procurement resources", text: "Visit UMUCYO Portal" },
] as const;

export type HomeCopyText = (typeof HOME_CMS_FIELDS)[number]["text"];
export type HomePageContent = {
  translations: Record<Language, Record<HomeCopyText, string>>;
  heroImageUrl: string;
};

const languages = ["en", "rw", "fr", "sw"] as const;
const copyTexts = [...new Set(HOME_CMS_FIELDS.map((field) => field.text))] as HomeCopyText[];

export const defaultHomePageContent: HomePageContent = {
  translations: Object.fromEntries(
    languages.map((language) => [
      language,
      Object.fromEntries(copyTexts.map((text) => [
        text,
        translateSiteCopy(language, text),
      ])),
    ]),
  ) as HomePageContent["translations"],
  heroImageUrl: "/site/hero-port.jpg",
};

/** Keep published and draft CMS documents compatible as homepage fields evolve. */
export function mergeHomePageContent(value: unknown): HomePageContent {
  if (!value || typeof value !== "object") return defaultHomePageContent;

  const stored = value as {
    heroImageUrl?: unknown;
    translations?: Partial<Record<Language, unknown>>;
  };
  const translations = Object.fromEntries(languages.map((language) => {
    const savedLanguage = stored.translations?.[language];
    const savedCopy = savedLanguage && typeof savedLanguage === "object"
      ? savedLanguage as Record<string, string>
      : {};
    return [language, { ...defaultHomePageContent.translations[language], ...savedCopy }];
  })) as HomePageContent["translations"];

  return {
    translations,
    heroImageUrl: typeof stored.heroImageUrl === "string" && stored.heroImageUrl.length > 0
      ? stored.heroImageUrl
      : defaultHomePageContent.heroImageUrl,
  };
}
