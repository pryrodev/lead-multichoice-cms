import { company, enquiryTypes, nav, processStages, procurementModels, procurementResources, leader } from "@/content/site";
import { industries, services, values, whyUs } from "@/content/services";
import { insights } from "@/content/insights";
import { cmsLanguages, messages, type CmsLanguage, type MessageKey } from "@/i18n/messages";
import { siteCopySourceTexts, translateSiteCopy } from "@/i18n/site-copy";
import { marketAccessContent } from "@/content/market-access-investment";

export type SiteCopyField = {
  id: string;
  source: string;
  group: string;
  locales?: CmsLanguage[];
  defaults: Record<CmsLanguage, string>;
};

const messageFields: SiteCopyField[] = (Object.keys(messages.en) as MessageKey[]).map((key) => ({
  id: `message:${key}`,
  source: messages.en[key],
  group: `Shared · ${key.split(".")[0]}`,
  defaults: Object.fromEntries(cmsLanguages.map((language) => [language, messages[language][key]])) as Record<CmsLanguage, string>,
}));

const copySources = new Map<string, { group: string; locales?: CmsLanguage[] }>();
for (const source of siteCopySourceTexts) copySources.set(source, { group: "Page copy" });

function collectFields(value: unknown, group: string): void {
  if (Array.isArray(value)) {
    value.forEach((item) => collectFields(item, group));
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    if (typeof child === "string" && ["title", "summary", "body", "text", "alt", "imageAlt", "category", "intro", "name", "description", "cta", "tagline", "note", "location", "label"].includes(key)) {
      copySources.set(child, { group });
    } else if (typeof child === "object") {
      collectFields(child, group);
    }
  }
}

collectFields(services, "Services");
collectFields(industries, "Industries");
collectFields(values, "About");
collectFields(whyUs, "Why choose us");
collectFields(processStages, "Company");
collectFields(procurementResources, "Procurement");
collectFields(procurementModels, "Procurement models");
collectFields(enquiryTypes, "Contact");
collectFields(leader, "Leadership");
for (const source of [...leader.summary, ...leader.bio, ...leader.tags, ...leader.credentials]) {
  if (!copySources.has(source)) copySources.set(source, { group: "Leadership" });
}
collectFields(company, "Company");
collectFields(nav, "Navigation");
collectFields(insights.en, "Blog");

function collectMarketAccessCopy(value: unknown, language: CmsLanguage): void {
  if (Array.isArray(value)) {
    value.forEach((item) => collectMarketAccessCopy(item, language));
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const child of Object.values(value as Record<string, unknown>)) {
    if (typeof child === "string") {
      const existing = copySources.get(child);
      if (!existing) copySources.set(child, { group: "Market Access & Investment", locales: [language] });
      else if (existing.group === "Market Access & Investment" && !existing.locales?.includes(language)) {
        existing.locales = [...(existing.locales ?? []), language];
      }
    } else if (typeof child === "object") {
      collectMarketAccessCopy(child, language);
    }
  }
}

for (const language of cmsLanguages) collectMarketAccessCopy(marketAccessContent[language], language);

const pageCopyFields: SiteCopyField[] = [...copySources].map(([source, metadata]) => ({
  id: `copy:${source}`,
  source,
  group: metadata.group,
  ...(metadata.locales ? { locales: metadata.locales } : {}),
  defaults: Object.fromEntries(cmsLanguages.map((language) => [
    language,
    metadata.locales?.includes(language) ? source : translateSiteCopy(language, source),
  ])) as Record<CmsLanguage, string>,
}));

export const SITE_COPY_FIELDS = [...messageFields, ...pageCopyFields];
export type SiteCopyContent = { translations: Record<CmsLanguage, Record<string, string>> };

export const defaultSiteCopyContent: SiteCopyContent = {
  translations: Object.fromEntries(cmsLanguages.map((language) => [
    language,
    Object.fromEntries(SITE_COPY_FIELDS.map((field) => [field.id, field.defaults[language]])),
  ])) as SiteCopyContent["translations"],
};

export function mergeSiteCopy(value: unknown): SiteCopyContent {
  if (!value || typeof value !== "object" || Array.isArray(value)) return defaultSiteCopyContent;
  const source = value as { translations?: Record<string, Record<string, unknown>> };
  return {
    translations: Object.fromEntries(cmsLanguages.map((language) => [
      language,
      Object.fromEntries(SITE_COPY_FIELDS.map((field) => {
        const saved = source.translations?.[language]?.[field.id];
        return [field.id, typeof saved === "string" ? saved : field.defaults[language]];
      })),
    ])) as SiteCopyContent["translations"],
  };
}
